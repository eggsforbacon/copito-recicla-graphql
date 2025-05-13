import prisma from "@/prisma";
import { UserInputError } from "apollo-server-micro";
import { sendTokenEmail } from "@/utils/sendEmail";
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
  },
};