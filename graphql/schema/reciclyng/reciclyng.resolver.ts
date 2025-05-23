import prisma from "@/prisma";
import { UserInputError } from "apollo-server-micro";
import { sendTokenEmail, sendAdminNotificationEmail, sendApprovalEmail } from "@/utils/sendEmail";
import { randomBytes } from "crypto";

type InputReciclyng = {
  input: {
    weight: number;
    entityId: number;
  };
};

type Reciclyng = {
  id: number;
  createdAt: Date;
  weight: number;
  entityId: number;
};

type TokenInput = {
  token: string;
};

type TokenResponse = {
  message: string;
};

type UpdateRequestInput = {
  input: {
    entityId: number;
    requestedWeight: number;
  };
};

type ApproveRequestInput = {
  requestId: number;
};

export const reciclyngResolver = {
  Mutation: {
    generateReciclyngToken: async (_: unknown, args: InputReciclyng): Promise<TokenResponse> => {
      const { weight, entityId } = args.input;

      const entity = await prisma.entity.findUnique({
        where: { id: entityId },
      });
      if (!entity) {
        throw new UserInputError(`No se encontró una entidad con ID ${entityId}`, {
          code: 400,
          status: 400,
        });
      }

      if (typeof weight !== "number" || isNaN(weight)) {
        throw new UserInputError("El peso debe ser un número válido", {
          code: 400,
          status: 400,
        });
      }

      const token = randomBytes(16).toString("hex");
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.token.create({
        data: {
          token,
          email: entity.email,
          entityId,
          weight,
          expiresAt,
        },
      });

      await sendTokenEmail(entity.email, token);

      return { message: `Token de confirmación enviado al correo ${entity.email}` };
    },

    confirmReciclyngToken: async (_: unknown, args: TokenInput): Promise<Reciclyng> => {
      const { token } = args;

      const tokenRecord = await prisma.token.findUnique({
        where: { token },
      });

      if (!tokenRecord) {
        throw new UserInputError("Token inválido", { code: 400, status: 400 });
      }

      if (tokenRecord.isUsed) {
        throw new UserInputError("El token ya ha sido usado", { code: 400, status: 400 });
      }

      if (new Date() > tokenRecord.expiresAt) {
        throw new UserInputError("El token ha expirado", { code: 400, status: 400 });
      }

      const newRecycling = await prisma.reciclyng.create({
        data: {
          weight: tokenRecord.weight!,
          entityId: tokenRecord.entityId,
        },
      });

      await prisma.token.update({
        where: { id: tokenRecord.id },
        data: { isUsed: true },
      });

      return newRecycling;
    },

    createReciclyng: async (_: unknown, args: InputReciclyng): Promise<Reciclyng> => {
      const { weight, entityId } = args.input;
      return await prisma.reciclyng.create({
        data: {
          weight,
          entityId,
        },
      });
    },

    createUpdateRequest: async (_: unknown, args: UpdateRequestInput): Promise<any> => {
      const { entityId, requestedWeight } = args.input;

      const entity = await prisma.entity.findUnique({
        where: { id: entityId },
      });
      if (!entity) {
        throw new UserInputError(`No se encontró una entidad con ID ${entityId}`, {
          code: 404,
          status: 404,
        });
      }

      const currentWeight = await prisma.reciclyng.aggregate({
        _sum: { weight: true },
        where: { entityId },
      });
      const currentTotal = currentWeight._sum.weight || 0;

      const updateRequest = await prisma.updateRequest.create({
        data: {
          entityId,
          requestedWeight,
          status: "pending",
        },
      });

      await sendAdminNotificationEmail({
        entityName: entity.name,
        requestedWeight,
        currentWeight: currentTotal,
        requestId: updateRequest.id,
      });

      return updateRequest;
    },

    approveUpdateRequest: async (_: unknown, args: ApproveRequestInput): Promise<any> => {
      const { requestId } = args;

      const updateRequest = await prisma.updateRequest.findUnique({
        where: { id: requestId },
      });

      if (!updateRequest) {
        throw new UserInputError(`No se encontró la solicitud con ID ${requestId}`, {
          code: 404,
          status: 404,
        });
      }

      if (updateRequest.status !== "pending") {
        throw new UserInputError("La solicitud ya ha sido procesada", {
          code: 400,
          status: 400,
        });
      }

      const newRecycling = await prisma.reciclyng.create({
        data: {
          weight: updateRequest.requestedWeight ?? 0,
          entityId: updateRequest.entityId,
        },
      });

      await prisma.updateRequest.update({
        where: { id: requestId },
        data: { status: "approved" },
      });

      const entity = await prisma.entity.findUnique({
        where: { id: updateRequest.entityId },
      });
      if (entity) {
        await sendApprovalEmail({
          entityEmail: entity.email,
          entityName: entity.name,
          approvedWeight: updateRequest.requestedWeight ?? 0,
        });
      }

      return newRecycling;
    },
  },
};