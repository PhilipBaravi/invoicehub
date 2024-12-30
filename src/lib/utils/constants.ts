// src/lib/utils/constants.ts

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || "https://api.invoicehub.space/api/v1/";
export const POST_LOGOUT_REDIRECT_URI: string =
  import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI || "https://invoicehub.space/";
export const KEYCLOAK_CONFIG_URL: string =
  import.meta.env.VITE_KEYCLOAK_CONFIG_URL ||
  "https://api.invoicehub.space/auth";

export const currencySymbols: { [key: string]: string } = {
  USD: "$",
  EUR: "€",
  GEL: "₾",
};
