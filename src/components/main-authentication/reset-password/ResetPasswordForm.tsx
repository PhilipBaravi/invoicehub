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

  const mockToken =
    "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJHXzhNcmZtZE5IaUdXQ2NVUVpTendWeW5qbGkwNDYwWjhqaS1wZlBKSVRVIn0.eyJleHAiOjE3MzU0MjU2MTAsImlhdCI6MTczNTQyNTMxMCwianRpIjoiMjZmZjAxOTUtNzI0NC00NDYxLWIzMjUtNTc4MTM0ZDkxMmZmIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2F1dGgvcmVhbG1zL2UtaW52b2ljZXMiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiYmM0MzVlZTMtNWNiMi00MmI0LTg2YTQtNGU5MmFkNjgxMmNkIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiaW52b2ljaW5nLWFwcCIsInNlc3Npb25fc3RhdGUiOiJhYzQ1YTFlMS0xNmVjLTRiYjctYmZiYS0zMmQ5OTkwM2I2YjciLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6OTA5MCIsImh0dHA6Ly9sb2NhbGhvc3Q6NTE3MyJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImRlZmF1bHQtcm9sZXMtZS1pbnZvaWNlcyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7Imludm9pY2luZy1hcHAiOnsicm9sZXMiOlsiQWRtaW4iXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJzaWQiOiJhYzQ1YTFlMS0xNmVjLTRiYjctYmZiYS0zMmQ5OTkwM2I2YjciLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkpvaG4gUmVlc2UiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJqb2hucmVlc2VAZW1haWwuY29tIiwiZ2l2ZW5fbmFtZSI6IkpvaG4iLCJmYW1pbHlfbmFtZSI6IlJlZXNlIiwiZW1haWwiOiJqb2hucmVlc2VAZW1haWwuY29tIn0.NnAiJUWDUzwx2gsnuEVovhcVkuABtPaK9fb0fFmi5zqbomy8tKXtfQ6Jba2WWFMCL2fhxtu82zxnIGzyJoHNDE7SwW-5KTLGSLYfytr8ZPhpp4G5pvwJGgdtXgpvyqsLCywwX5G7xsCJuM_6eqWhOdJEzx7jQBWPV3uY51jfCBC6owk7s8KiPOdeDM8DAraYMWf3_TspkTO3So4ebWhc-TMB8e23j8xZN9mlzGWFRpejHpQBNc7fY9DQqV80IKOoIhMJBIqlxmV5guxXBp2Vk86ovu8B57AphCUwSnSDw5JvZK1ut54HRAIWOr9cp58O8yIyvGDTMh89-RlUWryu-g";

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
            Authorization: `Bearer ${mockToken}`,
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
