import { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useAuth } from "./hooks/useAuth";
import { Progress } from "@radix-ui/react-progress";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({
  element: Element,
  allowedRoles = ["Admin", "Employee", "Manager"],
}: {
  element: JSX.Element;
  allowedRoles?: string[];
}) => {
  const { keycloak, initialized } = useKeycloak();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!initialized) return;

      if (!keycloak.authenticated) {
        const storedToken = localStorage.getItem("keycloak_token");
        const storedRefreshToken = localStorage.getItem(
          "keycloak_refresh_token"
        );
        const storedIdToken = localStorage.getItem("keycloak_id_token");

        if (storedToken && storedRefreshToken && storedIdToken) {
          console.log("Found stored tokens, attempting to restore session");
          keycloak.token = storedToken;
          keycloak.refreshToken = storedRefreshToken;
          keycloak.idToken = storedIdToken;
          keycloak.authenticated = true;

          try {
            const refreshed = await keycloak.updateToken(-1);
            console.log("Token refresh attempt result:", refreshed);
            if (!refreshed) {
              console.log("Token refresh failed, clearing stored tokens");
              localStorage.removeItem("keycloak_token");
              localStorage.removeItem("keycloak_refresh_token");
              localStorage.removeItem("keycloak_id_token");
              keycloak.authenticated = false;
            } else {
              localStorage.setItem("keycloak_token", keycloak.token!);
              localStorage.setItem(
                "keycloak_refresh_token",
                keycloak.refreshToken!
              );
              localStorage.setItem("keycloak_id_token", keycloak.idToken!);
            }
          } catch (error) {
            console.error("Token refresh failed:", error);
            localStorage.removeItem("keycloak_token");
            localStorage.removeItem("keycloak_refresh_token");
            localStorage.removeItem("keycloak_id_token");
            keycloak.authenticated = false;
          }
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [initialized, keycloak]);

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Progress value={100} className="w-[60%]" />
      </div>
    );
  }

  if (!keycloak.authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role.description)) {
    return <Navigate to="/dashboard" replace />;
  }

  return Element;
};
