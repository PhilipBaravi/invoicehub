import { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';

export interface LoggedInUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: {
    description: string;
  };
}

export const useAuth = () => {
  const { keycloak } = useKeycloak();
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      if (!keycloak.token) return;

      try {
        const response = await fetch('https://api.invoicehub.space/api/v1/user/loggedInUser', {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user data');

        const result = await response.json();
        setUser(result.data);
      } catch (error) {
        console.error('Error fetching logged-in user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (keycloak.authenticated) {
      fetchLoggedInUser();
    } else {
      setLoading(false);
    }
  }, [keycloak.token, keycloak.authenticated]);

  const isAdmin = user?.role?.description === 'Admin';
  const isEmployee = user?.role?.description === 'Employee';
  const isManager = user?.role?.description === 'Manager';

  return {
    user,
    loading,
    isAdmin,
    isEmployee,
    isManager,
  };
};