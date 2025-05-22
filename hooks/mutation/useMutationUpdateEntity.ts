import { useMutation } from "@apollo/client";
import { EntityType } from "@/types/entity";
import {
  FETCH_MUTATION_UPDATE_ENTITY,
  FETCH_MUTATION_GENERATE_ENTITY_TOKEN,
  FETCH_MUTATION_CONFIRM_ENTITY_TOKEN,
  FETCH_MUTATION_GENERATE_DELETE_TOKEN,
  FETCH_MUTATION_CONFIRM_DELETE_TOKEN,
} from "@/graphql/mutation/fetchEntity";
import { gql } from "@apollo/client";

export const CREATE_ENTITY_UPDATE_REQUEST = gql`
  mutation CreateEntityUpdateRequest($input: EntityUpdateRequestInput!) {
    createEntityUpdateRequest(input: $input) {
      id
      entityId
      updateData
      status
      createdAt
    }
  }
`;

export const useMutationUpdateEntity = () => {
  const [updateEntity, { loading: loadingUpdate }] = useMutation(FETCH_MUTATION_UPDATE_ENTITY);
  const [generateToken, { loading: loadingToken }] = useMutation(FETCH_MUTATION_GENERATE_ENTITY_TOKEN);
  const [confirmToken, { loading: loadingConfirm }] = useMutation(FETCH_MUTATION_CONFIRM_ENTITY_TOKEN);
  const [generateDeleteToken, { loading: loadingDeleteToken }] = useMutation(FETCH_MUTATION_GENERATE_DELETE_TOKEN);
  const [confirmDeleteToken, { loading: loadingDeleteConfirm }] = useMutation(FETCH_MUTATION_CONFIRM_DELETE_TOKEN);
  const [createEntityUpdateRequest, { loading: loadingCreateRequest }] = useMutation(CREATE_ENTITY_UPDATE_REQUEST);

  const useHandleUpdateEntity = async (data: EntityType) => {
    if (!data.id) {
      throw new Error("El campo 'id' es requerido para actualizar la entidad.");
    }
    return await updateEntity({
      variables: {
        input: {
          ...data,
          id: Number(data.id),
        },
      },
    });
  };

  const useHandleGenerateEntityToken = async (data: EntityType) => {
    if (!data.id) {
      throw new Error("El campo 'id' es requerido para generar el token.");
    }
    return await generateToken({
      variables: {
        input: {
          ...data,
          id: Number(data.id),
        },
      },
    });
  };

  const useHandleConfirmEntityToken = async (token: string) => {
    return await confirmToken({
      variables: {
        token,
      },
    });
  };

  const useHandleGenerateDeleteToken = async ({ id }: { id: number }) => {
    if (!id) {
      throw new Error("El campo 'id' es requerido para generar el token de eliminación.");
    }
    const response = await generateDeleteToken({
      variables: {
        id: Number(id),
      },
    });
    return response.data.generateDeleteToken.message;
  };

  const useHandleConfirmDeleteToken = async (token: string) => {
    if (!token) {
      throw new Error("El token es requerido para confirmar la eliminación.");
    }
    return await confirmDeleteToken({
      variables: {
        token,
      },
    });
  };

  const useHandleCreateEntityUpdateRequest = async (data: { entityId: number; updateData: string }) => {
    return await createEntityUpdateRequest({
      variables: {
        input: {
          entityId: data.entityId,
          updateData: data.updateData,
        },
      },
    });
  };

  return {
    useHandleUpdateEntity,
    useHandleGenerateEntityToken,
    useHandleConfirmEntityToken,
    loadingUpdate,
    loadingToken,
    loadingConfirm,
    useHandleGenerateDeleteToken,
    useHandleConfirmDeleteToken,
    loadingDeleteToken,
    loadingDeleteConfirm,
    useHandleCreateEntityUpdateRequest,
    loadingCreateRequest,
  };
};