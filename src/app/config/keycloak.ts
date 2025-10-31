/**
 * Keycloak configuration
 * Reads from environment variables with fallback defaults
 */
export const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:8080",
  realm: import.meta.env.VITE_KEYCLOAK_REALM || "master",
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "boilerplate-app",
};

