import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CountryCode,
  getCountryCallingCode,
  isValidPhoneNumber,
} from "libphonenumber-js";
import countryList from "../../account-details/profile-form/CountryCodes";
import { useTranslation } from "react-i18next";
import { useToast } from "@/lib/hooks/use-toast";
import { RegisterFormProps, UserFormValues } from "./types";

const RegisterForm: React.FC<RegisterFormProps> = ({ setUserDetails }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formValues, setFormValues] = useState<UserFormValues>({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [country, setCountry] = useState<CountryCode>("US");
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const navigate = useNavigate();
  const phoneCode = `+${getCountryCallingCode(country)}`;

  const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

  const validatePassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, password, confirmPassword, firstName, lastName, phone } =
      formValues;
    let valid = true;
    const newErrors: any = {};

    if (!validateEmail(username)) {
      newErrors.username = t("signUpForm.errors.validateEmail");
      valid = false;
      toast({
        title: t("form.error"),
        description: t("signUpForm.errors.validateEmail"),
        variant: "destructive",
        duration: 3000,
      });
    }

    if (!validatePassword(password)) {
      newErrors.password = t("signUpForm.errors.validatePassword");
      valid = false;
      toast({
        title: t("form.error"),
        description: t("signUpForm.errors.validatePassword"),
        variant: "destructive",
        duration: 3000,
      });
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = t("signUpForm.errors.confirmPassword");
      valid = false;
      toast({
        title: t("form.error"),
        description: t("signUpForm.errors.confirmPassword"),
        variant: "destructive",
        duration: 3000,
      });
    }

    if (!firstName) {
      newErrors.firstName = t("signUpForm.errors.firstName");
      valid = false;
      toast({
        title: t("form.error"),
        description: t("signUpForm.errors.firstName"),
        variant: "destructive",
        duration: 3000,
      });
    }

    if (!lastName) {
      newErrors.lastName = t("signUpForm.errors.lastName");
      valid = false;
      toast({
        title: t("form.error"),
        description: t("signUpForm.errors.lastName"),
        variant: "destructive",
        duration: 3000,
      });
    }

    const fullPhoneNumber = phoneCode + phone;
    if (!isValidPhoneNumber(fullPhoneNumber, country)) {
      newErrors.phone = t("signUpForm.errors.phone");
      valid = false;
      toast({
        title: t("form.error"),
        description: t("signUpForm.errors.phone"),
        variant: "destructive",
        duration: 3000,
      });
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    const userDetails = {
      username,
      password,
      confirmPassword,
      firstName,
      lastName,
      phone: fullPhoneNumber,
    };

    setUserDetails(userDetails);
    navigate("/company-registration");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCountryChange = (code: CountryCode) => setCountry(code);

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              id="firstName"
              name="firstName"
              value={formValues.firstName}
              onChange={handleChange}
              placeholder={t("signUpForm.firstName")}
              className="w-full"
              required
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName}</p>
            )}
          </div>
          <div>
            <Input
              id="lastName"
              name="lastName"
              value={formValues.lastName}
              onChange={handleChange}
              placeholder={t("signUpForm.lastName")}
              className="w-full"
              required
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <Input
            id="username"
            type="email"
            name="username"
            value={formValues.username}
            onChange={handleChange}
            placeholder={t("signUpForm.email")}
            className="w-full"
            required
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </div>

        <div className="flex space-x-2">
          <Select onValueChange={handleCountryChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue
                placeholder={
                  countryList.find((c) => c.code === country)?.name ||
                  t("signUpForm.selectCountry")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {countryList.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="phone"
            type="tel"
            name="phone"
            value={formValues.phone}
            onChange={handleChange}
            placeholder={phoneCode}
            className="w-full"
            required
          />
        </div>
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

        <div>
          <Input
            id="password"
            type="password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
            placeholder={t("signUpForm.password")}
            className="w-full"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
        <div>
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formValues.confirmPassword}
            onChange={handleChange}
            placeholder={t("signUpForm.confirmPassword")}
            className="w-full"
            required
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        <Button className="w-full">{t("signUpForm.companyInfo")}</Button>
      </form>

      <p className="mt-6 text-center text-xs text-stone-500 dark:text-stone-400">
        {t("signUpForm.haveAnAccount")}{" "}
        <Link to="/login" className="underline hover:text-stone-300">
          {t("signUpForm.login")}
        </Link>
      </p>
    </>
  );
};

export default RegisterForm;
