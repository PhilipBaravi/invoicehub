import { useState } from "react";
// import { useKeycloak } from "@react-keycloak/web";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
// import GoogleIcon from "../GoogleIcon";
// import AppleIcon from "../AppleIcon";
import { useTranslation } from "react-i18next";
import { useToast } from "@/lib/hooks/use-toast";
import { directLogin } from "@/lib/utils/keycloak";
import EmailVerificationWindow from "../new-register-page/EmailVerificationWindow";
import { API_BASE_URL } from "@/lib/utils/constants";
import { useKeycloak } from "@react-keycloak/web";
import { POST_LOGOUT_REDIRECT_URI } from "@/lib/utils/constants";

const LoginForm = () => {
  const { t } = useTranslation();
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationWindow, setShowVerificationWindow] = useState(false);
  // const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { keycloak } = useKeycloak();

  /**
   * Verifies if the email associated with the provided address is verified.
   * This function retrieves the token from local storage and sends it as a
   * Bearer token in the request header to the API endpoint.
   *
   * @param {string} email - The email address to verify.
   * @returns {Promise<boolean>} - True if the email is verified, false otherwise.
   */
  const checkEmailVerification = async (email: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem("keycloak_token");
      if (!token) throw new Error("No token available");

      const response = await fetch(
        `${API_BASE_URL}user/checkUserStatus/${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
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
        title: t("form.error"),
        description: t("loginForm.fillAll"),
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const tokens = await directLogin(loginEmail, loginPassword);
      localStorage.setItem("keycloak_token", tokens.access_token);

      const isVerified = await checkEmailVerification(loginEmail);
      if (isVerified) {
        toast({
          title: t("form.success"),
          description: t("loginForm.loginSuccess"),
          duration: 3000,
        });
        navigate("/dashboard");
      } else {
        toast({
          title: t("form.error"),
          description: t("loginForm.emailNotVerified"),
          variant: "destructive",
          duration: 3000,
        });
        const idToken = localStorage.getItem("keycloak_id_token");
        if (idToken) {
          e.preventDefault();

          const logoutUrl = `${keycloak.authServerUrl}/realms/${keycloak.realm}/protocol/openid-connect/logout`;

          const payload = {
            id_token_hint: idToken,
            post_logout_redirect_uri: POST_LOGOUT_REDIRECT_URI,
          };

          // Send POST request to logout endpoint
          fetch(logoutUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(payload).toString(),
          })
            .then((response) => {
              if (response.ok) {
                console.log("Logout request successful");
                // Optionally navigate or refresh without redirecting
              } else {
                console.error("Logout request failed", response.status);
              }
            })
            .catch((error) => console.error("Logout error", error));
        }

        localStorage.removeItem("keycloak_token");
        localStorage.removeItem("keycloak_refresh_token");
        localStorage.removeItem("keycloak_id_token");

        setShowVerificationWindow(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: t("form.error"),
        description: t("loginForm.invalidDetails"),
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSocialLogin = (provider: "google" | "apple") => {
  //   keycloak
  //     .login({
  //       idpHint: provider,
  //       redirectUri: `${window.location.origin}/dashboard`,
  //     })
  //     .catch((error) => {
  //       console.error(`${provider} login error:`, error);
  //       toast({
  //         title: "Error",
  //         description: `Failed to login with ${provider}. Please try again.`,
  //         variant: "destructive",
  //         duration: 3000,
  //       });
  //     });
  // };

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

      {/* <div className="mt-6 pb-6 text-center text-sm">
        {t("loginForm.continueWith")}
      </div> */}

      {/* <Button
        type="button"
        className="w-full mb-4"
        onClick={() => handleSocialLogin("google")}
        disabled={isLoading}
      >
        <GoogleIcon />
        {t("loginForm.loginGoogle")}
      </Button>

      <Button
        type="button"
        className="w-full"
        onClick={() => handleSocialLogin("apple")}
        disabled={isLoading}
      >
        <AppleIcon />
        {t("loginForm.loginApple")}
      </Button> */}
      <div className="flex justify-between items-center">
        <p className="mt-6 text-center text-xs">
          {t("loginForm.haveAnAccount")}{" "}
          <Link to="/register" className="underline">
            {t("loginForm.signUp")}
          </Link>
        </p>

        <p className="mt-6 text-center text-xs">
          <Link to="/reset-password" className="underline">
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
