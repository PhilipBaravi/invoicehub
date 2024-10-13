import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ReactKeycloakProvider, useKeycloak } from "@react-keycloak/web";
import keycloak from "./components/main-authentication/new-login-page/keycloak";
import AccountDetails from "./components/account-details/AccountDetails";
import BusinessForm from "./components/account-details/business-form/BusinessFormDetails";
import IntentFormDetails from "./components/account-details/IntentForm.tsx/IntentFormDetails";
import Dashboard from "./components/dashboard/layout/Dashboard";
import DashboardDefault from "./components/dashboard/dashboarddefault/DashboardDefault";
import Employee from "./components/dashboard/employee/EmployeeList";
import Product from "./components/dashboard/product/Product";
import Profile from "./components/dashboard/profile/Profile";
import NewLoginPage from "./components/main-authentication/new-login-page/NewLoginPage";
import NewRegisterPage from "./components/main-authentication/new-register-page/NewRegisterPage";
import { ThemeProvider } from "./components/dashboard/layout/ThemeProvider";
import CompanyRegistrationForm from "./components/main-authentication/new-register-page/CompanyRegistrationForm";
import LoginRegisterLayout from "./components/main-authentication/LoginRegisterLayout";
import ClientVendorList from "./components/dashboard/clients/ClientVendorList";
import NotFound from "./NotFound";
import CompanyDetails from "./components/dashboard/company-settings/CompanyDetails";
import Invoice from "./components/dashboard/invoice/Invoice";

// UserDetails interface
interface UserDetails {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

// Main App Component
const App: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);

  // Initialize Keycloak when the app loads
  useEffect(() => {
    keycloak.init({
      onLoad: 'check-sso',  // Silent session check
      pkceMethod: 'S256',
      checkLoginIframe: true,  // Use iframe to track login session
    }).then(authenticated => {
      setKeycloakInitialized(true);  // Set initialization flag
      if (!authenticated) {
        console.log("User not authenticated. Redirecting to login...");
        keycloak.login();  // Redirect to Keycloak login if not authenticated
      } else {
        console.log("User authenticated");
      }
    }).catch(err => {
      console.error("Error during Keycloak initialization:", err);
    });
  }, []);

  // Render loading state while Keycloak is initializing
  if (!keycloakInitialized) {
    return <div>Loading...</div>;
  }

  // ProtectedRoute Component
  const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
    const { keycloak } = useKeycloak();

    useEffect(() => {
      console.log("Keycloak Authenticated:", keycloak.authenticated);
      if (keycloak.tokenParsed) {
        console.log("Token Parsed:", keycloak.tokenParsed);
      } else {
        console.log("Token not available");
      }

      if (keycloak.authenticated) {
        console.log("User is authenticated");
      } else {
        console.log("User is NOT authenticated");
      }
    }, [keycloak.authenticated]);

    if (!keycloak.authenticated) {
      return <Navigate to="/new-login" />;
    }

    return element;
  };

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      onEvent={(event, error) => {
        console.log("Keycloak event:", event);
        if (event === "onAuthSuccess") {
          console.log("Authentication successful");
        }
        if (event === "onAuthError") {
          console.error("Authentication error", error);
        }
        if (event === "onAuthLogout") {
          console.log("User logged out");
        }
      }}
    >
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route path="/new-login" element={<NewLoginPage />} />
            <Route
              path="new-register"
              element={<NewRegisterPage setUserDetails={setUserDetails} />}
            />
            <Route path="/" element={<NewRegisterPage setUserDetails={setUserDetails} />} />
            <Route path="/account-details" element={<AccountDetails />} />
            <Route path="/business-details" element={<BusinessForm />} />
            <Route path="/intent-details" element={<IntentFormDetails />} />
            <Route path="*" element={<NotFound />} />
            <Route
              path="/company-registration"
              element={
                <LoginRegisterLayout
                  title="Register Your Company"
                  subtitle="Enter your company details to register"
                >
                  <CompanyRegistrationForm userDetails={userDetails} />
                </LoginRegisterLayout>
              }
            />

            {/* Protected main dashboard route with nested routes */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Dashboard />} />}
            >
              <Route index element={<DashboardDefault />} />
              <Route path="employee" element={<Employee />} />
              <Route path="clients" element={<ClientVendorList />} />
              <Route path="invoice" element={<Invoice />} />
              <Route path="product" element={<Product />} />
              <Route path="profile" element={<Profile />} />
              <Route path="company-details" element={<CompanyDetails />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </ReactKeycloakProvider>
  );
};

export default App;
