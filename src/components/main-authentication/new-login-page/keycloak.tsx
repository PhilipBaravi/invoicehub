import Keycloak from 'keycloak-js';

interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

const keycloakConfig = {
  url: 'https://api.invoicehub.space/auth/',
  realm: 'e-invoices',
  clientId: 'invoicing-app-react-login',
  enableCors: true,
};

let keycloakInstance: Keycloak | null = null;

const getKeycloak = () => {
  if (!keycloakInstance) {
    console.log('Initializing new Keycloak instance');
    keycloakInstance = new Keycloak(keycloakConfig);
    
    // Configure token refresh with a 70-second threshold
    keycloakInstance.onTokenExpired = () => {
      console.log('Token expired, attempting refresh');
      keycloakInstance?.updateToken(70)
        .then((refreshed) => {
          if (refreshed) {
            console.log('Token refreshed successfully');
            // Update stored tokens after successful refresh
            if (keycloakInstance?.token) {
              localStorage.setItem('keycloak_token', keycloakInstance.token);
            }
            if (keycloakInstance?.refreshToken) {
              localStorage.setItem('keycloak_refresh_token', keycloakInstance.refreshToken);
            }
          } else {
            console.log('Token still valid, no refresh needed');
          }
        })
        .catch(() => {
          console.error('Failed to refresh token, logging out');
          localStorage.removeItem('keycloak_token');
          localStorage.removeItem('keycloak_refresh_token');
          keycloakInstance?.logout();
        });
    };

    // Check for stored tokens on initialization
    const storedToken = localStorage.getItem('keycloak_token');
    const storedRefreshToken = localStorage.getItem('keycloak_refresh_token');
    
    if (storedToken && storedRefreshToken) {
      console.log('Found stored tokens, setting up Keycloak instance');
      keycloakInstance.token = storedToken;
      keycloakInstance.refreshToken = storedRefreshToken;
      keycloakInstance.authenticated = true;
    }
  }
  
  return keycloakInstance;
};

export const directLogin = async (username: string, password: string): Promise<AuthTokens> => {
  console.log('Attempting direct login for user:', username);
  try {
    const response = await fetch(`${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: keycloakConfig.clientId,
        grant_type: 'password',
        username,
        password,
      }),
    });

    if (!response.ok) {
      console.error('Authentication failed:', response.status);
      throw new Error('Authentication failed');
    }

    const tokens: AuthTokens = await response.json();
    console.log('Login successful, storing tokens');
    
    // Store tokens in localStorage
    localStorage.setItem('keycloak_token', tokens.access_token);
    localStorage.setItem('keycloak_refresh_token', tokens.refresh_token);

    // Update Keycloak instance with new tokens
    const keycloak = getKeycloak();
    keycloak.token = tokens.access_token;
    keycloak.refreshToken = tokens.refresh_token;
    keycloak.authenticated = true;

    return tokens;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Add a check for existing authentication
export const checkExistingAuth = async () => {
  const keycloak = getKeycloak();
  const storedToken = localStorage.getItem('keycloak_token');
  const storedRefreshToken = localStorage.getItem('keycloak_refresh_token');

  if (storedToken && storedRefreshToken && !keycloak.authenticated) {
    try {
      keycloak.token = storedToken;
      keycloak.refreshToken = storedRefreshToken;
      const refreshed = await keycloak.updateToken(-1);
      
      if (refreshed) {
        keycloak.authenticated = true;
        return true;
      }
    } catch (error) {
      console.error('Failed to restore authentication:', error);
      localStorage.removeItem('keycloak_token');
      localStorage.removeItem('keycloak_refresh_token');
    }
  }

  return keycloak.authenticated;
};

export default getKeycloak();