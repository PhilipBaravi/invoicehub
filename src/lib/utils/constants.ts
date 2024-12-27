// src/lib/utils/constants.ts

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9090/api/v1/";
export const POST_LOGOUT_REDIRECT_URI: string =
  import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI || "http://localhost:5173/";
export const KEYCLOAK_CONFIG_URL: string =
  import.meta.env.VITE_KEYCLOAK_CONFIG_URL || "http://localhost:8080/auth";

export const currencySymbols: { [key: string]: string } = {
  USD: "$",
  EUR: "€",
  GEL: "₾",
};
