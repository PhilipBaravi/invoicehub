// utils/api.ts
import keycloak from "./keycloak"; // Adjust the path based on Keycloak initialization file

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = keycloak.token;

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  // Check if there's a response body to parse
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json(); // Parse JSON if response has content
  }

  return null; // Return null if there's no JSON content
};
