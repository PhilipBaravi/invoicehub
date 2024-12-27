import keycloak from "./keycloak";
import { POST_LOGOUT_REDIRECT_URI } from "./constants";

export const logOut = async () => {
  if (!keycloak) return;

  const idToken = keycloak.idToken;

  if (!idToken) {
    console.error(
      "No id_token available to send as id_token_hint. Check Keycloak configuration or ensure a full login occurred."
    );
    return;
  }

  const logoutUrl = `${keycloak.authServerUrl}/realms/${
    keycloak.realm
  }/protocol/openid-connect/logout?id_token_hint=${encodeURIComponent(
    idToken
  )}&post_logout_redirect_uri=${encodeURIComponent(POST_LOGOUT_REDIRECT_URI)}`;

  // Clear tokens
  localStorage.removeItem("keycloak_token");
  localStorage.removeItem("keycloak_refresh_token");
  localStorage.removeItem("keycloak_id_token");

  window.location.href = logoutUrl;
};
