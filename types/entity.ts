export type EntityType = {
  id?: number,
  name: string,
  address: string,
  category: "JAC" | "CE",
  city: string,
  committee: boolean | null,
  commune: number,
  email: string,
  neighborhood: string,
  phone: string,
  position: string,
  acopio: boolean | null,
  acopioName?: string | null,
  prae?: boolean | null,
  praeName?: string | null,
  proceda?: boolean | null,
  procedaProject?: string | null,
  attachment: string | null,
}

export type EntityTypeUp = {
  input: any
  id: number,
  name: string,
  address: string,
  category: "JAC" | "CE",
  city: string,
  committee: boolean | null,
  commune: number,
  email: string,
  neighborhood: string,
  phone: string,
  position: string,
  acopio: boolean | null,
  acopioName?: string | null,
  prae?: boolean | null,
  praeName?: string | null,
  proceda?: boolean | null,
  procedaProject?: string | null,
  attachment: string | null,
}

export type EntityTypeGet = {
  input: any
  id: number,
  name: string,
  address: string,
  category: "JAC" | "CE",
  city: string,
  committee: boolean,
  commune: number,
  email: string,
  neighborhood: string,
  phone: string,
  position: string,
  acopio: boolean,
  acopioName?: string,
  prae: boolean,
  praeName?: string,
  proceda?: boolean,
  procedaProject?: string,
  attachment: string,
  nameEntity?: string ,
}

export interface EntityUpdateData {
  name?: string;
  nameEntity?: string;
  category?: "JAC" | "CE";
  email?: string;
  city?: string;
  neighborhood?: string;
  commune?: number;
  position?: string;
  address?: string;
  phone?: string;
  acopio?: boolean;
  acopioName?: string;
  prae?: boolean;
  praeName?: string;
  proceda?: boolean;
  procedaProject?: string;
  committee?: boolean;
  attachment?: string;
}