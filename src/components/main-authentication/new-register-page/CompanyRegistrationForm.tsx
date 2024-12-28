import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import EmailVerificationWindow from "./EmailVerificationWindow";
import { CompanyRegistrationFormProps, CompanyFormValues } from "./types";
import { API_BASE_URL } from "@/lib/utils/constants";

const CompanyRegistrationForm: React.FC<CompanyRegistrationFormProps> = ({
  userDetails,
}) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [companyCountry, setCompanyCountry] = useState<CountryCode>("US");
  const [showVerificationWindow, setShowVerificationWindow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formValues, setFormValues] = useState<CompanyFormValues>({
    title: "",
    phone: "",
    website: "",
    email: "",
    address: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const companyPhoneCode = `+${getCountryCallingCode(companyCountry)}`;

  // Validation Function
  const validateForm = (): boolean => {
    let valid = true;
    const newErrors: Record<string, string> = {};

    if (!formValues.title) {
      newErrors.title = t("companySignUpForm.errors.companyName");
      valid = false;
    }

    const fullCompanyPhoneNumber = companyPhoneCode + formValues.phone;
    if (!isValidPhoneNumber(fullCompanyPhoneNumber, companyCountry)) {
      newErrors.phone = t("companySignUpForm.errors.companyPhone");
      valid = false;
    }

    if (!formValues.address.addressLine1) {
      newErrors.addressLine1 = t("companySignUpForm.errors.companyAddress");
      valid = false;
    }

    if (!formValues.address.city) {
      newErrors.city = t("companySignUpForm.errors.companyCity");
      valid = false;
    }

    if (!formValues.address.state) {
      newErrors.state = t("companySignUpForm.errors.companyState");
      valid = false;
    }

    if (!formValues.address.zipCode) {
      newErrors.zipCode = t("companySignUpForm.errors.zipCode");
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) return;

    const registrationData = {
      username: userDetails?.username,
      password: userDetails?.password,
      confirmPassword: userDetails?.confirmPassword,
      firstName: userDetails?.firstName,
      lastName: userDetails?.lastName,
      phone: userDetails?.phone,
      company: {
        title: formValues.title,
        phone: companyPhoneCode + formValues.phone,
        website: formValues.website || "",
        email: formValues.email,
        address: {
          addressLine1: formValues.address.addressLine1,
          addressLine2: formValues.address.addressLine2 || "",
          city: formValues.address.city,
          state: formValues.address.state,
          country: companyCountry,
          zipCode: formValues.address.zipCode,
        },
      },
    };

    console.log("Sending registration data:", registrationData);

    try {
      const response = await fetch(`${API_BASE_URL}register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const data = await response.json();
        handleServerError(data, response.status);
        return;
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      setShowVerificationWindow(true);
    } catch (error: any) {
      console.error("Error during registration:", error);
      setErrors({
        title: t("companySignUpForm.errors.registrationFailed"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleServerError = (data: any, status: number) => {
    if (status === 409) {
      if (
        data?.message ===
        `"${userDetails?.username}" is already exists in a system.`
      ) {
        toast({
          title: t("form.error"),
          description: `${userDetails?.username} ${t(
            "signUpForm.errors.exists"
          )}`,
          variant: "destructive",
          duration: 3000,
        });
      } else if (data?.message === "Company with that name already exists.") {
        toast({
          title: t("form.error"),
          description: t("signUpForm.errors.companyExists"),
          variant: "destructive",
          duration: 3000,
        });
      }
    } else {
      toast({
        title: t("form.error"),
        description: t("companySignUpForm.errors.registrationFailed"),
        variant: "destructive",
        duration: 3000,
      });
    }
    throw new Error(data?.message || "Registration failed with server error.");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormValues((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CompanyFormValues] as object),
          [child]: value,
        },
      }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name.split(".").pop()!]: "" }));
  };

  const handleCompanyCountryChange = (code: CountryCode) => {
    setCompanyCountry(code);
    setFormValues((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        country: code,
      },
    }));
  };

  const handleCloseVerificationWindow = () => {
    setShowVerificationWindow(false);
    navigate("/login");
  };

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Input
            id="title"
            name="title"
            value={formValues.title}
            onChange={handleChange}
            placeholder={t("companySignUpForm.companyName")}
            className="w-full"
            required
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <Input
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder={t("loginForm.email")}
            className="w-full"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              id="address.addressLine1"
              name="address.addressLine1"
              value={formValues.address.addressLine1}
              onChange={handleChange}
              placeholder={t("companySignUpForm.addressLine1")}
              className="w-full"
              required
            />
            {errors.addressLine1 && (
              <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>
            )}
          </div>
          <div>
            <Input
              id="address.addressLine2"
              name="address.addressLine2"
              value={formValues.address.addressLine2}
              onChange={handleChange}
              placeholder={t("companySignUpForm.addressLine2")}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Input
              id="address.city"
              name="address.city"
              value={formValues.address.city}
              onChange={handleChange}
              placeholder={t("companySignUpForm.city")}
              className="w-full"
              required
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>
          <div>
            <Input
              id="address.state"
              name="address.state"
              value={formValues.address.state}
              onChange={handleChange}
              placeholder={t("companySignUpForm.state")}
              className="w-full"
              required
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state}</p>
            )}
          </div>
          <div>
            <Input
              id="address.zipCode"
              name="address.zipCode"
              value={formValues.address.zipCode}
              onChange={handleChange}
              placeholder={t("companySignUpForm.zipCode")}
              className="w-full"
              required
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <Select onValueChange={handleCompanyCountryChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue
                placeholder={
                  countryList.find((c) => c.code === companyCountry)?.name ||
                  t("companySignUpForm.selectCountry")
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
            name="phone"
            value={formValues.phone}
            onChange={handleChange}
            placeholder={companyPhoneCode}
            className="w-full"
            required
          />
        </div>
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}

        <div>
          <Input
            id="website"
            name="website"
            value={formValues.website}
            onChange={handleChange}
            placeholder={t("companySignUpForm.website")}
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading..." : t("companySignUpForm.submitBtn")}
        </Button>
      </form>
      {showVerificationWindow && (
        <EmailVerificationWindow
          email={userDetails?.username || ""}
          onClose={handleCloseVerificationWindow}
        />
      )}
    </>
  );
};

export default CompanyRegistrationForm;
