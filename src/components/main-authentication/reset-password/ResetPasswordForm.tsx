import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/lib/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const ResetPasswordForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    email: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

  const validatePassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, newPassword, confirmNewPassword } = formValues;
    let valid = true;
    const newErrors: any = {};

    // Email validation
    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
        duration: 3000,
      });
    }

    // Password validation
    if (!validatePassword(newPassword)) {
      newErrors.newPassword =
        "Password must include uppercase, lowercase, a number, and a special character.";
      valid = false;
      toast({
        title: "Error",
        description:
          "Password must include uppercase, lowercase, a number, and a special character.",
        variant: "destructive",
        duration: 3000,
      });
    }

    if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match.";
      valid = false;
      toast({
        title: "Error",
        description: "Passwords do not match.",
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
        `http://localhost:9090/api/v1/password/forgot-password?email=${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Password Recovery",
          description: "Password recovery link has been sent to your email.",
          variant: "success",
          duration: 5000,
        });
        navigate("/login");
      } else {
        if (data.httpStatus === "NOT_FOUND") {
          toast({
            title: "Error",
            description: "User not found.",
            variant: "destructive",
            duration: 3000,
          });
        } else {
          toast({
            title: "Error",
            description: "An error occurred, please try again.",
            variant: "destructive",
            duration: 3000,
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred, please try again.",
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
          Email
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

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
          New Password
        </label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          value={formValues.newPassword}
          onChange={handleChange}
          placeholder="••••••••"
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
          Confirm New Password
        </label>
        <Input
          id="confirmNewPassword"
          name="confirmNewPassword"
          type="password"
          value={formValues.confirmNewPassword}
          onChange={handleChange}
          placeholder="••••••••"
          required
          disabled={isLoading}
        />
        {errors.confirmNewPassword && (
          <p className="text-red-500 text-sm">{errors.confirmNewPassword}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Recovery Link"}
      </Button>

      <p className="mt-6 text-xs">
        <Link to="/login" className="underline">
          Back to Login
        </Link>
      </p>
    </form>
  );
};

export default ResetPasswordForm;
