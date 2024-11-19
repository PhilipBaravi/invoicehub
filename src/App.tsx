import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ReactKeycloakProvider, useKeycloak } from "@react-keycloak/web";
import keycloak from "./components/main-authentication/new-login-page/keycloak";
import AccountDetails from "./components/account-details/AccountDetails";
import BusinessForm from "./components/account-details/business-form/BusinessFormDetails";
import IntentFormDetails from "./components/account-details/IntentForm.tsx/IntentFormDetails";
import Dashboard from "./components/dashboard/layout/Dashboard";
import DashboardDefault from "./components/dashboard/dashboarddefault/DashboardDefault";
import Employee from "./components/dashboard/employee/EmployeeList";
import ProductsPage from "./components/dashboard/products/ProductsPage";
import NewLoginPage from "./components/main-authentication/new-login-page/NewLoginPage";
import NewRegisterPage from "./components/main-authentication/new-register-page/NewRegisterPage";
import { ThemeProvider } from "./components/dashboard/layout/ThemeProvider";
import CompanyRegistrationForm from "./components/main-authentication/new-register-page/CompanyRegistrationForm";
import LoginRegisterLayout from "./components/main-authentication/LoginRegisterLayout";
import ClientVendorList from "./components/dashboard/clients/ClientVendorList";
import NotFound from "./NotFound";
import Settings from "./components/dashboard/company-settings/Settings";
import ProfileSubscription from "./components/dashboard/subscription/ProfileSubscription";
import ManagePaymentMethods from "./components/dashboard/subscription/ManagePaymentMethods";
import Categories from "./components/dashboard/products/categories/Categories";
import UpdateCompanyDetails from "./components/dashboard/company-settings/UpdateCompanyDetails";
import InvoiceListPage from "./components/dashboard/invoice/invoice-list-page/InvoiceListPage";
import { Progress } from "@/components/ui/progress";
import Invoice from "./components/dashboard/invoice/Invoice";
import PrivacyPolicy from "./components/main-authentication/privacyPolicy";
import './i18n';
import { useTranslation } from "react-i18next";

// UserDetails interface
interface UserDetails {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

// ProtectedRoute Component
const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { keycloak, initialized } = useKeycloak();
  const [progress, setProgress] = useState(0);

  // Debugging statements
  console.log("ProtectedRoute - Keycloak initialized:", initialized);
  console.log("ProtectedRoute - Keycloak authenticated:", keycloak.authenticated);
  console.log("ProtectedRoute - Keycloak instance:", keycloak);

  useEffect(() => {
    if (!initialized) {
      const timer = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 10 : 100));
      }, 300);
      return () => clearInterval(timer);
    } else {
      setProgress(100);
    }
  }, [initialized]);

  // Display the progress bar while initializing
  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Progress value={progress} className="w-[60%]" />
      </div>
    );
  }

  // Proceed to the element if authenticated, otherwise show the login page
  return keycloak.authenticated ? element : <NewLoginPage />;
};

// Main App Component
const App: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const { t } = useTranslation();

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      onEvent={(event, error) => {
        console.log("Keycloak event:", event);
        if (error) console.error("Keycloak error:", error);

        // Additional debug for specific events
        if (event === "onInitError") {
          console.error("Keycloak initialization error:", error);
        }
      }}
      initOptions={{
        onLoad: "check-sso",
        // silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
        pkceMethod: "S256",
        debug: true, // Enable debugging in Keycloak (may produce more detailed output)
      }}
    >
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route path="/login" element={<NewLoginPage />} />
            <Route
              path="/register"
              element={<NewRegisterPage setUserDetails={setUserDetails} />}
            />
            <Route path="/" element={<NewRegisterPage setUserDetails={setUserDetails} />} />
            <Route path="/account-details" element={<AccountDetails />} />
            <Route path="/business-details" element={<BusinessForm />} />
            <Route path="/intent-details" element={<IntentFormDetails />} />
            <Route path="*" element={<NotFound />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route
              path="/company-registration"
              element={
                <LoginRegisterLayout
                  title={t('companySignUpForm.company.title')}
                  subtitle={t('companySignUpForm.company.subtitle')}
                >
                  <CompanyRegistrationForm userDetails={userDetails} />
                </LoginRegisterLayout>
              }
            />

            {/* Protected main dashboard route with nested routes */}
            <Route path="/dashboard/*" element={<ProtectedRoute element={<Dashboard />} />}>
              <Route index element={<DashboardDefault />} />
              <Route path="employee" element={<Employee />} />
              <Route path="clients" element={<ClientVendorList />} />
              <Route path="invoices" element={<InvoiceListPage />} />
              <Route path="invoices/new-invoice" element={<Invoice />} />
              <Route path="invoices/edit/:id" element={<Invoice />} />
              <Route path="settings" element={<Settings />} >
                <Route index element={<UpdateCompanyDetails />} />
                <Route path="profile-subscription" element={<ProfileSubscription />} />
                <Route path="payment-methods" element={<ManagePaymentMethods />} />
              </Route>
              <Route path="categories" element={<Categories />} >
                <Route path="products" element={<ProductsPage />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </ReactKeycloakProvider>
  );
};

export default App;
