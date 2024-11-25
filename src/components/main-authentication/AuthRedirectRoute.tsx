import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { Progress } from '@/components/ui/progress';

interface AuthRedirectRouteProps {
  element: JSX.Element;
}

const AuthRedirectRoute: React.FC<AuthRedirectRouteProps> = ({ element }) => {
  const { keycloak, initialized } = useKeycloak();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!initialized) {
        return;
      }

      console.log('Checking authentication state:', {
        initialized,
        authenticated: keycloak.authenticated,
        token: !!keycloak.token,
      });

      if (!keycloak.authenticated) {
        const storedToken = localStorage.getItem('keycloak_token');
        const storedRefreshToken = localStorage.getItem('keycloak_refresh_token');

        if (storedToken && storedRefreshToken) {
          try {
            keycloak.token = storedToken;
            keycloak.refreshToken = storedRefreshToken;
            const refreshed = await keycloak.updateToken(-1);
            
            if (refreshed) {
              console.log('Token refreshed successfully');
              keycloak.authenticated = true;
            } else {
              console.log('Token refresh failed, clearing stored tokens');
              localStorage.removeItem('keycloak_token');
              localStorage.removeItem('keycloak_refresh_token');
            }
          } catch (error) {
            console.error('Token refresh error:', error);
            localStorage.removeItem('keycloak_token');
            localStorage.removeItem('keycloak_refresh_token');
          }
        }
      }

      setIsChecking(false);
    };

    checkAuthentication();
  }, [initialized, keycloak]);

  if (!initialized || isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Progress value={100} className="w-[60%]" />
      </div>
    );
  }

  // Only redirect to dashboard if authenticated and this is the login page
  if (keycloak.authenticated) {
    console.log('User is authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('User is not authenticated, showing login page');
  return element;
};

export default AuthRedirectRoute;