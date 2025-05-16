import { gql } from "apollo-server-micro";

export const EntityTypeDefs = gql`
  type Entity {
    id: ID!
    name: String!
    nameEntity: String!
    category: CATEGORY
    email: String!
    city: String!
    neighborhood: String
    commune: Int!
    position: String
    address: String
    phone: String
    acopio: Boolean
    acopioName: String
    prae: Boolean
    praeName: String
    proceda: Boolean
    procedaProject: String
    committee: Boolean
    attachment: String
    reciclyng: [Reciclyng]
  }

  input EntityInput {
    name: String!
    nameEntity: String!
    category: CATEGORY
    email: String!
    city: String!
    neighborhood: String
    commune: Int!
    position: String
    address: String
    phone: String
    acopio: Boolean
    acopioName: String
    prae: Boolean
    praeName: String
    proceda: Boolean
    procedaProject: String
    committee: Boolean
    attachment: String!
  }

  input EntityInputUpdate {
    id: Int!
    name: String
    nameEntity: String
    category: CATEGORY
    email: String
    city: String
    neighborhood: String
    commune: Int
    position: String
    address: String
    phone: String
    acopio: Boolean
    acopioName: String
    prae: Boolean
    praeName: String
    proceda: Boolean
    procedaProject: String
    committee: Boolean
    attachment: String
  }

  type TokenResponse {
    message: String!
  }

  type OutEntityByRecicling {
    id: ID!
    name: String!
    nameEntity: String!
    city: String!
    weight: Float!
    category: CATEGORY!
    email: String!
    neighborhood: String
    position: String
    address: String
    acopio: Boolean
    acopioName: String
    prae: Boolean
    praeName: String
    proceda: Boolean
    procedaProject: String
    committee: Boolean
    commune: Int!
    phone: String
  }

  type Query {
    findAllEntities: [Entity!]!
    findEntity(id: Int!): Entity
    findAllEntitiesByReciclyn: [OutEntityByRecicling!]!
  }

  type Mutation {
    createEntity(input: EntityInput!): Entity
    updateEntity(input: EntityInputUpdate!): Entity
    generateEntityUpdateToken(input: EntityInputUpdate!): TokenResponse!
    confirmEntityUpdateToken(token: String!): Entity!
    generateDeleteToken(id: Int!): TokenResponse!
    confirmDeleteToken(token: String!): Boolean!
    generateDownloadToken: TokenResponse!
    confirmDownloadToken(token: String!): Boolean!
  }

  enum CATEGORY {
    JAC
    CE
  }
`;