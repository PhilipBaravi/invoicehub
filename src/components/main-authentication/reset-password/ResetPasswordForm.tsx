import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/lib/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "@/lib/utils/constants";
import { useTranslation } from "react-i18next";

const ResetPasswordForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email } = formValues;
    let valid = true;
    const newErrors: any = {};

    // Email validation
    if (!validateEmail(email)) {
      newErrors.email = t("reset.errors.validEmail");
      valid = false;
      toast({
        title: t("form.error"),
        description: t("reset.errors.validEmail"),
        variant: "destructive",
        duration: 3000,
      });
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}password/forgot-password?email=${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        toast({
          title: t("form.success"),
          description: t("reset.passwordSuccess"),
          variant: "success",
          duration: 5000,
        });
        navigate("/login");
      } else {
        if (data.httpStatus === "NOT_FOUND") {
          toast({
            title: t("form.error"),
            description: t("reset.errors.userNotFound"),
            variant: "destructive",
            duration: 3000,
          });
        } else {
          toast({
            title: t("form.error"),
            description: t("reset.errors.error"),
            variant: "destructive",
            duration: 3000,
          });
        }
      }
    } catch (error) {
      toast({
        title: t("form.error"),
        description: t("reset.errors.error"),
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          {t("loginForm.email")}
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formValues.email}
          onChange={handleChange}
          placeholder="name@example.com"
          required
          disabled={isLoading}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t("reset.btn.sending") : t("reset.btn.sendRecoveryLink")}
      </Button>

      <p className="mt-6 text-xs">
        <Link to="/login" className="underline">
          {t("reset.btn.backToLogin")}
        </Link>
      </p>
    </form>
  );
};

export default ResetPasswordForm;
