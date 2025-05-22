import { UserInputError } from "apollo-server-micro";
import prisma from "@/prisma";
import { EntityType, EntityTypeUp, EntityUpdateData } from "@/types/entity";
import { sendTokenEmail, sendAdminUpdateNotificationEmail, sendEntityUpdateApprovalEmail } from "@/utils/sendEmail";
import { randomBytes } from "crypto";
import { sendDeleteTokenEmail } from "@/utils/sendEmail";

const NODEMAILER_HOST_EMAIL = process.env.NODEMAILER_HOST_EMAIL;

type InputEntity = {
  input: EntityType;
};

type entityByReciclingType = {
  id: number;
  name: string;
  weight: number;
  city: string;
  category: "JAC" | "CE";
  nameEntity: string;
  email: string;
  neighborhood: string;
  position: string;
  address: string;
  acopio: boolean | null;
  acopioName: string | null;
  prae: boolean | null;
  praeName: string | null;
  proceda: boolean | null;
  procedaProject: string | null;
  committee: boolean | null;
  commune: number | null;
  phone: string;
};

type EntityToW = {
  id: number;
  name: string;
  category: "JAC" | "CE";
  nameEntity: string;
  city: string;
  reciclyng: {
    id: number;
    createdAt: Date;
    weight: number;
    entityId: number;
  }[];
};

type TokenResponse = {
  message: string;
};

type EntityUpdateRequestInput = {
  input: {
    entityId: number;
    updateData: string;
  };
};

type ApproveEntityUpdateRequestInput = {
  requestId: number;
};

const getChangedFields = (currentData: any, updateData: any): string[] => {
  const changedFields: string[] = [];
  for (const [key, newValue] of Object.entries(updateData)) {
    if (key === 'id') continue;
    const oldValue = currentData[key];
    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      changedFields.push(key);
    }
  }
  return changedFields;
};

export const entityResolvers = {
  Query: {
    findAllEntities: async (): Promise<EntityType[]> =>
      await prisma.entity.findMany(),

    findAllEntitiesByReciclyn: async (): Promise<entityByReciclingType[]> => {
      const entities = await prisma.entity.findMany({
        where: {
          id: { not: 0 },
        },
        orderBy: { id: "desc" },
        include: {
          reciclyng: true,
        },
      });

      const entityByWeight: entityByReciclingType[] = [];

      entities.forEach((entity) => {
        const weight = entity.reciclyng.reduce(
          (sum, reciclyng) => +sum + +reciclyng.weight,
          0
        );
        entityByWeight.push({
          id: entity.id,
          name: entity.name,
          weight,
          category: entity.category,
          nameEntity: entity.nameEntity,
          city: entity.city,
          email: entity.email,
          neighborhood: entity.neighborhood,
          position: entity.position,
          address: entity.address,
          acopio: entity.acopio,
          acopioName: entity.acopioName,
          prae: entity.prae,
          praeName: entity.praeName,
          proceda: entity.proceda,
          procedaProject: entity.procedaProject,
          committee: entity.committee,
          commune: entity.commune,
          phone: entity.phone,
        });
      });

      return entityByWeight;
    },

    findEntity: async (
      _parent: unknown,
      args: { id: number }
    ): Promise<EntityType | null> => await findEntity(args.id),
  },

  Mutation: {
    createEntity: async (
      _: unknown,
      args: EntityTypeUp
    ): Promise<EntityType> => {
      const entityExist = await findEntityByEmail(args.input.email);
      if (entityExist) {
        throw new UserInputError("Este correo ya se encuentra registrado", {
          code: 400,
          status: 400,
        });
      }

      return await prisma.entity.create({
        data: {
          ...args.input,
        },
      });
    },

    updateEntity: async (
      _: unknown,
      args: InputEntity
    ): Promise<EntityType> => {
      const { id, ...data } = args.input;

      const entityId = Number(id);
      if (isNaN(entityId)) {
        throw new UserInputError("El ID proporcionado no es un número válido", {
          code: 400,
          status: 400,
        });
      }

      const entity = await prisma.entity.findUnique({
        where: { id: entityId },
      });
      if (!entity) {
        throw new UserInputError(
          `No se encontró una entidad con ID ${entityId}`,
          {
            code: 400,
            status: 400,
          }
        );
      }

      if (data.email && data.email !== entity.email) {
        const existingEntity = await findEntityByEmail(data.email);
        if (existingEntity && existingEntity.id !== entityId) {
          throw new UserInputError("Este correo ya se encuentra registrado", {
            code: 400,
            status: 400,
          });
        }
      }

      return await prisma.entity.update({
        where: { id: entityId },
        data: {
          ...data,
          attachment:
            data.attachment !== undefined ? data.attachment : entity.attachment,
        },
      });
    },

    generateEntityUpdateToken: async (
      _: unknown,
      args: InputEntity
    ): Promise<TokenResponse> => {
      const { id, ...data } = args.input;

      const entityId = Number(id);
      if (isNaN(entityId)) {
        throw new UserInputError("El ID proporcionado no es un número válido", {
          code: 400,
          status: 400,
        });
      }

      const entity = await prisma.entity.findUnique({
        where: { id: entityId },
      });
      if (!entity) {
        throw new UserInputError(
          `No se encontró una entidad con ID ${entityId}`,
          {
            code: 400,
            status: 400,
          });
      }

      if (data.email && data.email !== entity.email) {
        const existingEntity = await findEntityByEmail(data.email);
        if (existingEntity && existingEntity.id !== entityId) {
          throw new UserInputError("Este correo ya se encuentra registrado", {
            code: 400,
            status: 400,
          });
        }
      }

      const token = randomBytes(16).toString("hex");
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.token.create({
        data: {
          token,
          email: entity.email,
          entityId,
          data: data,
          expiresAt,
        },
      });

      await sendTokenEmail(entity.email, token);

      return { message: `Token enviado al correo ${entity.email}` };
    },

    confirmEntityUpdateToken: async (
      _: unknown,
      args: { token: string }
    ): Promise<EntityType> => {
      const { token } = args;

      const tokenRecord = await prisma.token.findUnique({
        where: { token },
      });

      if (!tokenRecord) {
        throw new UserInputError("Token inválido", { code: 400, status: 400 });
      }

      if (tokenRecord.isUsed) {
        throw new UserInputError("El token ya ha sido usado", {
          code: 400,
          status: 400,
        });
      }

      if (new Date() > tokenRecord.expiresAt) {
        throw new UserInputError("El token ha expirado", { code: 400, status: 400 });
      }

      const entity = await prisma.entity.findUnique({
        where: { id: tokenRecord.entityId },
      });
      if (!entity) {
        throw new UserInputError(
          `No se encontró una entidad con ID ${tokenRecord.entityId}`,
          { code: 400, status: 400 }
        );
      }

      if (!tokenRecord.data || typeof tokenRecord.data !== "object") {
        throw new UserInputError("Datos de actualización inválidos", {
          code: 400,
          status: 400,
        });
      }

      const updateData = tokenRecord.data as EntityUpdateData;

      const updatedEntity = await prisma.entity.update({
        where: { id: tokenRecord.entityId },
        data: {
          ...updateData,
          attachment:
            updateData.attachment !== undefined
              ? updateData.attachment
              : entity.attachment,
        },
      });

      await prisma.token.update({
        where: { id: tokenRecord.id },
        data: { isUsed: true },
      });

      return updatedEntity;
    },

    generateDeleteToken: async (
      _: unknown,
      args: { id: number },
    ): Promise<TokenResponse> => {
      const entityId = Number(args.id);
      if (isNaN(entityId)) {
        throw new UserInputError("El ID proporcionado no es un número válido", {
          code: 400,
          status: 400,
        });
      }

      const entity = await prisma.entity.findUnique({
        where: { id: entityId },
      });
      if (!entity) {
        throw new UserInputError(`No se encontró una entidad con ID ${entityId}`, {
          code: 400,
          status: 400,
        });
      }

      const token = randomBytes(16).toString("hex");
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.token.create({
        data: {
          token,
          email: NODEMAILER_HOST_EMAIL || "",
          entityId,
          data: undefined,
          expiresAt,
        },
      });

      await sendDeleteTokenEmail(token, entityId);

      return { message: `Token enviado al correo del administrador` };
    },

    confirmDeleteToken: async (
      _: unknown,
      args: { token: string },
    ): Promise<boolean> => {
      const { token } = args;

      const tokenRecord = await prisma.token.findUnique({
        where: { token },
      });

      if (!tokenRecord) {
        throw new UserInputError("Token inválido", { code: 400, status: 400 });
      }

      if (tokenRecord.isUsed) {
        throw new UserInputError("El token ya ha sido usado", {
          code: 400,
          status: 400,
        });
      }

      if (new Date() > tokenRecord.expiresAt) {
        throw new UserInputError("El token ha expirado", { code: 400, status: 400 });
      }

      const entity = await prisma.entity.findUnique({
        where: { id: tokenRecord.entityId },
      });
      if (!entity) {
        throw new UserInputError(
          `No se encontró una entidad con ID ${tokenRecord.entityId}`,
          { code: 400, status: 400 }
        );
      }

      await prisma.reciclyng.deleteMany({
        where: { entityId: tokenRecord.entityId },
      });

      await prisma.token.deleteMany({
        where: { entityId: tokenRecord.entityId },
      });

      await prisma.updateRequest.deleteMany({
        where: { entityId: tokenRecord.entityId },
      });

      await prisma.entity.delete({
        where: { id: tokenRecord.entityId },
      });

      return true;
    },

    generateDownloadToken: async (): Promise<TokenResponse> => {
      const token = randomBytes(16).toString("hex");
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      let adminEntity = await prisma.entity.findFirst({
        where: { email: "admin@copitorecicla.com" },
      });

      if (!adminEntity) {
        adminEntity = await prisma.entity.create({
          data: {
            name: "Administrador",
            nameEntity: "Copito Recicla Admin",
            category: "JAC",
            email: "admin@copitorecicla.com",
            city: "Cali",
            neighborhood: "Centro",
            commune: 1,
            position: "Admin",
            address: "N/A",
            phone: "0000000000",
          },
        });
      }

      await prisma.token.create({
        data: {
          token,
          email: NODEMAILER_HOST_EMAIL || "",
          entityId: adminEntity.id,
          expiresAt,
        },
      });

      await sendTokenEmail(NODEMAILER_HOST_EMAIL || "", token);

      return { message: "Token enviado al correo del administrador" };
    },

    confirmDownloadToken: async (
      _: unknown,
      args: { token: string }
    ): Promise<boolean> => {
      const { token } = args;

      const tokenRecord = await prisma.token.findUnique({
        where: { token },
      });

      if (!tokenRecord) {
        throw new UserInputError("Token inválido", { code: 400, status: 400 });
      }

      if (tokenRecord.isUsed) {
        throw new UserInputError("El token ya ha sido usado", {
          code: 400, status: 400,
        });
      }

      if (new Date() > tokenRecord.expiresAt) {
        throw new UserInputError("El token ha expirado", { code: 400, status: 400 });
      }

      await prisma.token.update({
        where: { id: tokenRecord.id },
        data: { isUsed: true },
      });

      return true;
    },

    createEntityUpdateRequest: async (_: unknown, args: EntityUpdateRequestInput): Promise<any> => {
      const { entityId, updateData } = args.input;

      const entity = await prisma.entity.findUnique({
        where: { id: entityId },
      });
      if (!entity) {
        throw new UserInputError(`No se encontró una entidad con ID ${entityId}`, {
          code: 404,
          status: 404,
        });
      }

      const updateRequest = await prisma.updateRequest.create({
        data: {
          entityId,
          updateData,
          status: "pending",
        },
      });

      await sendAdminUpdateNotificationEmail({
        entityName: entity.name,
        currentData: entity,
        updateData,
        requestId: updateRequest.id,
      });

      return updateRequest;
    },

    approveEntityUpdateRequest: async (_: unknown, args: ApproveEntityUpdateRequestInput): Promise<any> => {
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

      const updateDataString = updateRequest.updateData
        ? typeof updateRequest.updateData === 'string'
          ? updateRequest.updateData
          : JSON.stringify(updateRequest.updateData)
        : '{}';
      const updateData = JSON.parse(updateDataString);

      const currentEntity = await prisma.entity.findUnique({
        where: { id: updateRequest.entityId },
      });

      if (!currentEntity) {
        throw new UserInputError(`No se encontró una entidad con ID ${updateRequest.entityId}`, {
          code: 404,
          status: 404,
        });
      }

      const changedFields = getChangedFields(currentEntity, updateData);

      const updatedEntity = await prisma.entity.update({
        where: { id: updateRequest.entityId },
        data: updateData,
      });

      await prisma.updateRequest.update({
        where: { id: requestId },
        data: { status: "approved" },
      });

      if (changedFields.length > 0) {
        await sendEntityUpdateApprovalEmail({
          entityEmail: updatedEntity.email,
          entityName: updatedEntity.name,
          updatedFields: changedFields,
        });
      }

      return updatedEntity;
    },
  },
};

const findEntity = async (id: number): Promise<EntityType | null> =>
  await prisma.entity.findFirst({
    where: { id },
  });

const findEntityByEmail = async (email: string): Promise<EntityType | null> =>
  await prisma.entity.findFirst({
    where: { email },
  });