import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ReactKeycloakProvider } from '@react-keycloak/web';
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

// Define the type for user details
interface UserDetails {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

const App: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  return (
    <ReactKeycloakProvider authClient={keycloak}>
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

            {/* Main dashboard route with nested routes */}
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<DashboardDefault />} />
              <Route path="employee" element={<Employee />} />
              <Route path="clients" element={<ClientVendorList />} />
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
