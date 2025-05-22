import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

export const FETCH_MUTATION_RECICLING = gql`
  mutation GenerateReciclyngToken($input: ReciclyngInput!) {
    generateReciclyngToken(input: $input) {
      message
    }
  }
`;

export const CONFIRM_RECICLYNG_TOKEN = gql`
  mutation ConfirmReciclyngToken($token: String!) {
    confirmReciclyngToken(token: $token) {
      id
      weight
    }
  }
`;

export const CREATE_UPDATE_REQUEST = gql`
  mutation CreateUpdateRequest($input: UpdateRequestInput!) {
    createUpdateRequest(input: $input) {
      id
      entityId
      requestedWeight
      status
      createdAt
    }
  }
`;

export const useMutationReciclyn = () => {
  const [generateToken, { loading: loadingToken }] = useMutation(FETCH_MUTATION_RECICLING);
  const [confirmToken, { loading: loadingConfirm }] = useMutation(CONFIRM_RECICLYNG_TOKEN);
  const [createUpdateRequest, { loading: loadingCreateRequest }] = useMutation(CREATE_UPDATE_REQUEST);

  const HandleGenerateToken = async (data: { entityId: number; weight: number }) => {
    return await generateToken({
      variables: {
        input: {
          weight: data.weight,
          entityId: data.entityId,
        },
      },
    });
  };

  const HandleConfirmToken = async (token: string) => {
    return await confirmToken({
      variables: {
        token,
      },
    });
  };

  const HandleCreateUpdateRequest = async (data: { entityId: number; requestedWeight: number }) => {
    return await createUpdateRequest({
      variables: {
        input: {
          entityId: data.entityId,
          requestedWeight: data.requestedWeight,
        },
      },
    });
  };

  return {
    HandleGenerateToken,
    HandleConfirmToken,
    HandleCreateUpdateRequest,
    loadingToken,
    loadingConfirm,
    loadingCreateRequest,
  };
};