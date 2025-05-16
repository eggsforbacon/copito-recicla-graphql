import { useMutation } from "@apollo/client";
import {
  FETCH_MUTATION_GENERATE_DOWNLOAD_TOKEN,
  FETCH_MUTATION_CONFIRM_DOWNLOAD_TOKEN,
} from "@/graphql/mutation/fetchEntity";

export const useMutationDownload = () => {
  const [generateDownloadToken, { loading: loadingToken }] = useMutation(
    FETCH_MUTATION_GENERATE_DOWNLOAD_TOKEN
  );
  const [confirmDownloadToken, { loading: loadingConfirm }] = useMutation(
    FETCH_MUTATION_CONFIRM_DOWNLOAD_TOKEN
  );

  const HandleGenerateDownloadToken = async () => {
    try {
      const { data } = await generateDownloadToken();
      return data.generateDownloadToken.message;
    } catch (error) {
      throw error;
    }
  };

  const HandleConfirmDownloadToken = async (token: string) => {
    try {
      const { data } = await confirmDownloadToken({
        variables: { token },
      });
      return data.confirmDownloadToken;
    } catch (error) {
      throw error;
    }
  };

  return {
    HandleGenerateDownloadToken,
    HandleConfirmDownloadToken,
    loadingToken,
    loadingConfirm,
  };
};