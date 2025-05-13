import { UserInputError } from "apollo-server-micro";
import prisma from "@/prisma";
import { EntityType, EntityTypeUp, EntityUpdateData } from "@/types/entity";
import { sendTokenEmail } from "@/utils/sendEmail";
import { randomBytes } from "crypto";

type InputEntity = {
  input: EntityType;
};

type entityByReciclingType = {
  id: number;
  name: string;
  weight: string;
  city: string;
  category: "JAC" | "CE";
  nameEntity: string;
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
    weight: string;
    entityId: number;
  }[];
};

type TokenResponse = {
  message: string;
};

export const entityResolvers = {
  Query: {
    findAllEntities: async (): Promise<EntityType[]> =>
      await prisma.entity.findMany(),

    findAllEntitiesByReciclyn: async (): Promise<entityByReciclingType[]> => {
      const entities = await prisma.entity.findMany({
        orderBy: { id: "desc" },
        include: {
          reciclyng: true,
        },
      });

      const entityByWeight: entityByReciclingType[] = [];

      entities.forEach((entity) => {
        const weight = entity.reciclyng.reduce(
          (sum, reciclyng) => sum + reciclyng.weight,
          0,
        ).toString();
        entityByWeight.push({
          id: entity.id,
          name: entity.name,
          weight,
          category: entity.category,
          nameEntity: entity.nameEntity,
          city: entity.city,
        });
      });

      return entityByWeight;
    },

    findEntity: async (
      _parent: unknown,
      args: { id: number },
    ): Promise<EntityType | null> => await findEntity(args.id),
  },

  Mutation: {
    createEntity: async (
      _: unknown,
      args: EntityTypeUp,
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
      args: InputEntity,
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
        throw new UserInputError(`No se encontró una entidad con ID ${entityId}`, {
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

      return await prisma.entity.update({
        where: { id: entityId },
        data: {
          ...data,
          attachment: data.attachment !== undefined ? data.attachment : entity.attachment,
        },
      });
    },

    generateEntityUpdateToken: async (
      _: unknown,
      args: InputEntity,
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
        throw new UserInputError(`No se encontró una entidad con ID ${entityId}`, {
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
      args: { token: string },
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
        throw new UserInputError("El token ha expirado", {
          code: 400,
          status: 400,
        });
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