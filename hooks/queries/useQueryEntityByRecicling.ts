import { useQuery } from "@apollo/client";
import { FETCH_ENTITIES_BY_RECICLING } from "../../graphql/queries/fetchEntities";

export const useQueryEntityByRecicling = () => {
  const { data, loading, error, refetch } = useQuery(FETCH_ENTITIES_BY_RECICLING);

  return {
    entities: data?.findAllEntitiesByReciclyn || [],
    loading,
    error,
    refetch,
  };
};