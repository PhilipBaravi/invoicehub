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
import type { UserFormValues } from "./RegisterForm";
import { useToast } from "@/hooks/use-toast";

interface CompanyRegistrationFormProps {
  userDetails: UserFormValues | null;
}

interface CompanyFormValues {
  title: string;
  phone: string;
  website: string;
  email: string;
  address: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

const CompanyRegistrationForm: React.FC<CompanyRegistrationFormProps> = ({
  userDetails,
}) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [companyCountry, setCompanyCountry] = useState<CountryCode>("US");

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let valid = true;
    const newErrors: Record<string, string> = {};

    // Client-side validation
    if (!formValues.title) {
      newErrors.title = t("companySignUpForm.errors.companyName");
      valid = false;
      toast({
        title: t("form.error"),
        description: t("companySignUpForm.errors.companyName"),
        variant: "destructive",
        duration: 3000,
      });
    }

    const fullCompanyPhoneNumber = companyPhoneCode + formValues.phone;
    if (!isValidPhoneNumber(fullCompanyPhoneNumber, companyCountry)) {
      newErrors.phone = t("companySignUpForm.errors.companyPhone");
      valid = false;
      toast({
        title: t("form.error"),
        description: t("companySignUpForm.errors.companyPhone"),
        variant: "destructive",
        duration: 3000,
      });
    }

    if (!formValues.address.addressLine1) {
      newErrors.addressLine1 = t("companySignUpForm.errors.companyAddress");
      valid = false;
      toast({
        title: t("form.error"),
        description: t("companySignUpForm.errors.companyAddress"),
        variant: "destructive",
        duration: 3000,
      });
    }

    if (!formValues.address.city) {
      newErrors.city = t("companySignUpForm.errors.companyCity");
      valid = false;
      toast({
        title: t("form.error"),
        description: t("companySignUpForm.errors.companyCity"),
        variant: "destructive",
        duration: 3000,
      });
    }

    if (!formValues.address.state) {
      newErrors.state = t("companySignUpForm.errors.companyState");
      valid = false;
      toast({
        title: t("form.error"),
        description: t("companySignUpForm.errors.companyState"),
        variant: "destructive",
        duration: 3000,
      });
    }

    if (!formValues.address.zipCode) {
      newErrors.zipCode = t("companySignUpForm.errors.zipCode");
      valid = false;
      toast({
        title: t("form.error"),
        description: t("companySignUpForm.errors.zipCode"),
        variant: "destructive",
        duration: 3000,
      });
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    const registrationData = {
      username: userDetails?.username,
      password: userDetails?.password,
      confirmPassword: userDetails?.confirmPassword,
      firstName: userDetails?.firstName,
      lastName: userDetails?.lastName,
      phone: userDetails?.phone,
      company: {
        title: formValues.title,
        phone: fullCompanyPhoneNumber,
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
      const response = await fetch(
        "https://api.invoicehub.space/api/v1/user/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registrationData),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      // Attempt to parse JSON response
      let data: any = null;
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json();
          console.log("Response data:", data);
        } catch (jsonError) {
          console.error("Failed to parse JSON response:", jsonError);
        }
      } else {
        console.warn("Response not in JSON format");
      }

      if (!response.ok) {
        console.error(
          "Server returned an error response:",
          response.status,
          data
        );
        if (
          response.status === 409 &&
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
        } else {
          toast({
            title: t("form.error"),
            description:
              data?.message || t("companySignUpForm.errors.registrationFailed"),
            variant: "destructive",
            duration: 3000,
          });
        }

        // Throw an error with more detail
        throw new Error(
          data?.message || "Registration failed with server error."
        );
      }

      console.log("Registration successful:", data);
      toast({
        title: t("form.success"),
        description: t("companySignUpForm.successMessage"),
        variant: "success",
        duration: 3000,
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error during registration:", error);
      console.log("Request payload that caused the error:", registrationData);
      setErrors({
        title: t("companySignUpForm.errors.registrationFailed"),
      });
      toast({
        title: t("form.error"),
        description:
          error.message || t("companySignUpForm.errors.registrationFailed"),
        variant: "destructive",
        duration: 3000,
      });
    }
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

  return (
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
            <p className="text-red-500 text-sm">{errors.addressLine1}</p>
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
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
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
            <p className="text-red-500 text-sm">{errors.state}</p>
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
            <p className="text-red-500 text-sm">{errors.zipCode}</p>
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
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      </div>

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
      <Button className="w-full">{t("companySignUpForm.submitBtn")}</Button>
    </form>
  );
};

export default CompanyRegistrationForm;
