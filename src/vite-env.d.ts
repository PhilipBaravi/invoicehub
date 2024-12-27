/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_POST_LOGOUT_REDIRECT_URI: string;
  readonly VITE_KEYCLOAK_CONFIG_URL: string;
  // Add more variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
