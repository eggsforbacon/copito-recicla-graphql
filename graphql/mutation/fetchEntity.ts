import { gql } from "@apollo/client";

export const FETCH_MUTATION_ENTITY = gql`
  mutation CreateEntity($input: EntityInput!) {
    createEntity(input: $input) {
      name
      category
      email
      city
      neighborhood
      commune
      position
      address
      phone
      acopio
      prae
      praeName
      proceda
      procedaProject
      committee
      attachment
    }
  }
`;

export const FETCH_MUTATION_UPDATE_ENTITY = gql`
  mutation UpdateEntity($input: EntityInputUpdate!) {
    updateEntity(input: $input) {
      id
      name
      nameEntity
      category
      email
      city
      neighborhood
      commune
      position
      address
      phone
      acopio
      acopioName
      prae
      praeName
      proceda
      procedaProject
      committee
      attachment
    }
  }
`;

export const FETCH_MUTATION_GENERATE_ENTITY_TOKEN = gql`
  mutation GenerateEntityUpdateToken($input: EntityInputUpdate!) {
    generateEntityUpdateToken(input: $input) {
      message
    }
  }
`;

export const FETCH_MUTATION_CONFIRM_ENTITY_TOKEN = gql`
  mutation ConfirmEntityUpdateToken($token: String!) {
    confirmEntityUpdateToken(token: $token) {
      id
      name
      nameEntity
      category
      email
      city
      neighborhood
      commune
      position
      address
      phone
      acopio
      acopioName
      prae
      praeName
      proceda
      procedaProject
      committee
      attachment
    }
  }
`;

export const FETCH_MUTATION_GENERATE_DELETE_TOKEN = gql`
  mutation GenerateDeleteToken($id: Int!) {
    generateDeleteToken(id: $id) {
      message
    }
  }
`;

export const FETCH_MUTATION_CONFIRM_DELETE_TOKEN = gql`
  mutation ConfirmDeleteToken($token: String!) {
    confirmDeleteToken(token: $token)
  }
`;

export const FETCH_MUTATION_GENERATE_DOWNLOAD_TOKEN = gql`
  mutation GenerateDownloadToken {
    generateDownloadToken {
      message
    }
  }
`;

export const FETCH_MUTATION_CONFIRM_DOWNLOAD_TOKEN = gql`
  mutation ConfirmDownloadToken($token: String!) {
    confirmDownloadToken(token: $token)
  }
`;

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