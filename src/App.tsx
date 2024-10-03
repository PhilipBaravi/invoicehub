import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/main-authentication/login-page/LoginPage";
import RegisterPage from "./components/main-authentication/register-page/RegisterPage";
import EmailVerification from "./components/main-authentication/EmailVerification";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/" element={<RegisterPage />} /> {/* Default route to login */}
      </Routes>
    </Router>
  );
};

export default App;
