import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";
import { useToast } from "@/lib/hooks/use-toast";
import { directLogin } from "@/lib/utils/keycloak";
import EmailVerificationWindow from "../new-register-page/EmailVerificationWindow";
import { API_BASE_URL } from "@/lib/utils/constants";
import { useSearchParams } from "react-router-dom";

const LoginForm = () => {
  const { t } = useTranslation();
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationWindow, setShowVerificationWindow] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  /**
   * Verifies if the email associated with the provided address is verified.
   *
   * @param {string} email - The email address to verify.
   * @returns {Promise<boolean>} - True if the email is verified, false otherwise.
   */
  const checkEmailVerification = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}register/checkUserStatus/${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log(data);
      console.log(email);
      return data.data;
    } catch (error) {
      console.error("Error checking email verification:", error);
      return false;
    }
  };

  const handleDirectLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    // Check if the email is verified before attempting login
    const isEmailVerified = await checkEmailVerification(loginEmail);

    if (!isEmailVerified) {
      toast({
        title: "Error",
        description: "Your email is not verified. Please check your inbox.",
        variant: "destructive",
        duration: 3000,
      });
      setIsLoading(false);
      setShowVerificationWindow(true); // Optionally show verification window
      return;
    }

    try {
      const tokens = await directLogin(loginEmail, loginPassword);
      if (tokens.access_token) {
        toast({
          title: "Success",
          description: "Successfully logged in!",
          duration: 3000,
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Invalid username or password",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseVerificationWindow = () => {
    setShowVerificationWindow(false);
  };

  return (
    <>
      <form onSubmit={handleDirectLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            {t("loginForm.email")}
          </label>
          <Input
            id="email"
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="name@example.com"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            {t("loginForm.password")}
          </label>
          <Input
            id="password"
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Link to="/privacy-policy">
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 underline cursor-pointer"
            >
              {t("loginForm.privacyPolicy")}
            </label>
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("loginForm.login") : t("loginForm.loginBtn")}
        </Button>
      </form>

      <div className="flex justify-between items-center">
        <p className="mt-6 text-center text-xs">
          {t("loginForm.haveAnAccount")}{" "}
          <Link to="/register" className="underline">
            {t("loginForm.signUp")}
          </Link>
        </p>

        <p className="mt-6 text-center text-xs">
          <Link to="/reset-password-page" className="underline">
            {t("loginForm.forgotPassword")}
          </Link>
        </p>
      </div>

      {showVerificationWindow && (
        <EmailVerificationWindow
          email={loginEmail}
          onClose={handleCloseVerificationWindow}
        />
      )}
    </>
  );
};

export default LoginForm;
