import { Input } from "@/components/ui/input";
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/lib/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "@/lib/utils/constants";

const ResetPasswordConfirmationForm: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formValues, setFormValues] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const validatePassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { newPassword, confirmNewPassword } = formValues;
    const newErrors = { newPassword: "", confirmNewPassword: "" };
    let valid = true;

    // Validate new password
    if (!validatePassword(newPassword)) {
      newErrors.newPassword = t("reset.errors.passwordValidation");
      valid = false;
      toast({
        title: t("form.error"),
        description: t("reset.errors.passwordValidation"),
        variant: "destructive",
        duration: 3000,
      });
    }

    // Check if passwords match
    if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = t("reset.errors.dontMatch");
      valid = false;
      toast({
        title: t("form.error"),
        description: t("reset.errors.dontMatch"),
        variant: "destructive",
        duration: 3000,
      });
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}password/new-password?email=${email}&token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword, confirmNewPassword }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      // Simulate successful response
      toast({
        title: t("form.success"),
        description: t("reset.errors.resetSuccess"),
        variant: "success",
        duration: 3000,
      });
      navigate("/login");
    } catch (e: unknown) {
      console.error(e);
      toast({
        title: t("form.error"),
        description: t("reset.errors.resetFailed"),
        variant: "destructive",
        duration: 3000,
      });
    }

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium mb-1"
          >
            {t("reset.password.newPassword")}
          </label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            value={formValues.newPassword}
            onChange={handleChange}
            placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
            required
            disabled={isLoading}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm">{errors.newPassword}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmNewPassword"
            className="block text-sm font-medium mb-1"
          >
            {t("reset.password.confirmNewPassword")}
          </label>
          <Input
            id="confirmNewPassword"
            name="confirmNewPassword"
            type="password"
            value={formValues.confirmNewPassword}
            onChange={handleChange}
            placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
            required
            disabled={isLoading}
          />
          {errors.confirmNewPassword && (
            <p className="text-red-500 text-sm">{errors.confirmNewPassword}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("reset.btn.loading") : t("reset.btn.submit")}
        </Button>

        <p className="mt-6 text-xs">
          <Link to="/login" className="underline">
            {t("reset.btn.backToLogin")}
          </Link>
        </p>
      </form>
    </>
  );
};

export default ResetPasswordConfirmationForm;
