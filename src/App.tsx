import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/main-authentication/login-page/LoginPage";
import RegisterPage from "./components/main-authentication/register-page/RegisterPage";
import EmailVerification from "./components/main-authentication/EmailVerification";
import AccountDetails from "./components/account-details/AccountDetails";
import BusinessForm from "./components/account-details/business-form/BusinessFormDetails";
import IntentFormDetails from "./components/account-details/IntentForm.tsx/IntentFormDetails";
import Dashboard from "./components/dashboard/layout/Dashboard";
import DashboardDefault from "./components/dashboard/dashboarddefault/DashboardDefault";
import Employee from "./components/dashboard/employee/EmployeeList";
import Product from "./components/dashboard/product/Product";
import Profile from "./components/dashboard/profile/Profile";
import NewLoginPage from "./components/main-authentication/new-login-page/NewLoginPage";
import { ThemeProvider } from "./components/dashboard/layout/ThemeProvider";
import NewRegisterPage from "./components/main-authentication/new-register-page/NewRegisterPage";


const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <Router>
      <Routes>
        <Route path="/new-login" element={<NewLoginPage />} />
        <Route path="new-register" element={<NewRegisterPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/" element={<NewRegisterPage />} /> {/* Default route */}
        <Route path="/account-details" element={<AccountDetails />} />
        <Route path="/business-details" element={<BusinessForm />} />
        <Route path="/intent-details" element={<IntentFormDetails />} />
        
        {/* Main dashboard route with nested routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardDefault />} /> {/* Default dashboard content */}
          <Route path="employee" element={<Employee />} /> 
          <Route path="product" element={<Product />} /> 
          <Route path="profile" element={<Profile />} /> 
        </Route>
      </Routes>
    </Router>
    </ThemeProvider> 
  );
};

export default App;
