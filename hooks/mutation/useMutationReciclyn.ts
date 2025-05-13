import { useMutation } from "@apollo/client";
import { FETCH_MUTATION_RECICLING, CONFIRM_RECICLYNG_TOKEN } from "@/graphql/mutation/fetchRecicling";

export const useMutationReciclyn = () => {
  const [generateToken, { loading: loadingToken }] = useMutation(FETCH_MUTATION_RECICLING);
  const [confirmToken, { loading: loadingConfirm }] = useMutation(CONFIRM_RECICLYNG_TOKEN);

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

  return { HandleGenerateToken, HandleConfirmToken, loadingToken, loadingConfirm };
};