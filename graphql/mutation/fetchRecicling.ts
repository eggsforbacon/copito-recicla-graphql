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