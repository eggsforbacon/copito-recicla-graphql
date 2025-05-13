import { gql } from "apollo-server-micro";

export const ReciclyngTypeDefs = gql`
  type Reciclyng {
    id: ID!
    weight: Float!
    createdAt: String
  }

  input ReciclyngInput {
    weight: Float!
    entityId: Int!
  }

  type TokenResponse {
    message: String!
  }

  type Mutation {
    createReciclyng(input: ReciclyngInput): Reciclyng
    generateReciclyngToken(input: ReciclyngInput!): TokenResponse!
    confirmReciclyngToken(token: String!): Reciclyng!
  }
`;