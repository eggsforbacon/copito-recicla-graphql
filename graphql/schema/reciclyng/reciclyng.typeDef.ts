import { gql } from "apollo-server-micro";

export const ReciclyngTypeDefs = gql`
  type Reciclyng {
    id: ID!
    weight: Float!
    createdAt: String
  }

  type Query {
  totalReciclyng: Float!
  }

  input ReciclyngInput {
    weight: Float!
    entityId: Int!
  }

  type TokenResponse {
    message: String!
  }

  type UpdateRequest {
    id: ID!
    entityId: Int!
    requestedWeight: Float!
    status: String!
    createdAt: String!
  }

  input UpdateRequestInput {
    entityId: Int!
    requestedWeight: Float!
  }

  type Mutation {
    createReciclyng(input: ReciclyngInput): Reciclyng
    generateReciclyngToken(input: ReciclyngInput!): TokenResponse!
    confirmReciclyngToken(token: String!): Reciclyng!
    createUpdateRequest(input: UpdateRequestInput!): UpdateRequest!
    approveUpdateRequest(requestId: Int!): Reciclyng!
  }
`;