import { gql } from "@apollo/client";

export const FETCH_ENTITIES = gql`
  query findAllEntities {
    findAllEntities {
      id
      name
      reciclyng {
        weight
      }
    }
  }
`;

export const FETCH_ENTITY_BY_ID = gql`
  query FindEntity($findEntityId: Int!) {
    findEntity(id: $findEntityId) {
      acopio
      acopioName
      address
      attachment
      category
      city
      committee
      commune
      email
      id
      name
      nameEntity
      neighborhood
      phone
      position
      prae
      praeName
      proceda
      procedaProject
    }
  }
`;

export const FETCH_ENTITIES_BY_RECICLING = gql`
  query FindAllEntitiesByReciclyn {
    findAllEntitiesByReciclyn {
      name
      nameEntity
      weight
      city
      id
      category
      email
      neighborhood
      position
      address
      acopio
      prae
      praeName
      proceda
      procedaProject
      committee
      commune
      phone
    }
  }
`;

/**
 * export const FETCH_ENTITIES = gql`
  query FetchEntities {
    id
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
    acopioName
    prae
    praeName
    proceda
    procedaProject
    committee
    attachment
    reciclyng {
      weight
    }
  }
`;
 */