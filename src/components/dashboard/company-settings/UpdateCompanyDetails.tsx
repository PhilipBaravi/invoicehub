import { useState, useEffect, FC } from "react";
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useKeycloak } from "@react-keycloak/web";
import { useToast } from "@/lib/hooks/use-toast";
import { API_BASE_URL } from "@/lib/utils/constants";

const UpdateCompanyDetails: FC = () => {
  const [formValues, setFormValues] = useState({
    title: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    website: "",
    email: "",
  });
  const [companyCountry, setCompanyCountry] = useState<CountryCode>("US");
  const [errors, setErrors] = useState<{
    title?: string;
    addressLine1?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
    email?: string;
  }>({});
  const { t } = useTranslation();
  const { keycloak } = useKeycloak();
  const companyPhoneCode = `+${getCountryCallingCode(companyCountry)}`;
  const [companyId, setCompanyId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}user/loggedInUser`, {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const user = data.data;

          const company = user.company;
          setCompanyId(company.id);

          setFormValues({
            title: company.title || "",
            addressLine1: company.address?.addressLine1 || "",
            addressLine2: company.address?.addressLine2 || "",
            city: company.address?.city || "",
            state: company.address?.state || "",
            zipCode: company.address?.zipCode || "",
            phone: company.phone.replace(/^\+\(\d+\)-/, "") || "",
            website: company.website || "",
            email: company.email || "",
          });

          const countryCode = countryList.find(
            (c) =>
              c.name.toLowerCase() === company.address?.country.toLowerCase()
          )?.code;
          if (countryCode) setCompanyCountry(countryCode as CountryCode);
        } else {
          console.error("Failed to fetch logged-in user data");
        }
      } catch (error) {
        console.error("Error fetching logged-in user data:", error);
      }
    };

    fetchUserData();
  }, [keycloak.token]);

  const handleSubmit = async (
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    if (e) e.preventDefault();

    const { title, addressLine1, city, state, zipCode, phone, email } =
      formValues;

    let valid = true;
    const newErrors: typeof errors = {};

    // Company Title
    if (!title.trim()) {
      newErrors.title = t("companySignUpForm.errors.companyName");
      valid = false;
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = t("companySignUpForm.errors.emailRequired");
      valid = false;
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = t("companySignUpForm.errors.invalidEmail");
      valid = false;
    }

    // Phone Number
    const fullCompanyPhoneNumber = `${companyPhoneCode}${phone.trim()}`;
    if (!isValidPhoneNumber(fullCompanyPhoneNumber, companyCountry)) {
      newErrors.phone = t("companySignUpForm.errors.companyPhone");
      valid = false;
    }

    // Address Line 1
    if (!addressLine1.trim()) {
      newErrors.addressLine1 = t("companySignUpForm.errors.companyAddress");
      valid = false;
    }

    // City
    if (!city.trim()) {
      newErrors.city = t("companySignUpForm.errors.companyCity");
      valid = false;
    }

    // State
    if (!state.trim()) {
      newErrors.state = t("companySignUpForm.errors.companyState");
      valid = false;
    }

    // Zip Code
    if (!zipCode.trim()) {
      newErrors.zipCode = t("companySignUpForm.errors.zipCode");
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}company/update/${companyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keycloak.token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            phone: fullCompanyPhoneNumber,
            website: formValues.website.trim(),
            email: email.trim(),
            address: {
              addressLine1: addressLine1.trim(),
              addressLine2: formValues.addressLine2.trim(),
              city: city.trim(),
              state: state.trim(),
              zipCode: zipCode.trim(),
              country:
                countryList.find((c) => c.code === companyCountry)?.name || "",
            },
          }),
        }
      );

      if (response.ok) {
        console.log("Company details updated successfully");
        toast({
          title: t("form.success"),
          description: t("form.companyUpdateSuccess"),
          variant: "success",
          duration: 3000,
        });
        setErrors({});
      } else {
        console.error("Failed to update company details");
        toast({
          title: t("form.error"),
          description: t("form.companyUpdateError"),
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating company details:", error);
      toast({
        title: t("form.error"),
        description: t("form.companyUpdateError"),
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Handle input changes and clear corresponding errors
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));

    // Clear the error for the field being modified
    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  };

  // Handle company country selection and re-validate phone number
  const handleCompanyCountryChange = (code: CountryCode) => {
    setCompanyCountry(code);
    // Re-validate phone number when country changes
    if (formValues.phone) {
      const fullCompanyPhoneNumber = `+${getCountryCallingCode(
        code
      )}${formValues.phone.trim()}`;
      if (isValidPhoneNumber(fullCompanyPhoneNumber, code)) {
        setErrors((prevErrors) => ({ ...prevErrors, phone: undefined }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phone: t("companySignUpForm.errors.companyPhone"),
        }));
      }
    }
  };

  return (
    <div className="px-4">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Company Name */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            {t("companySignUpForm.companyName")}
          </label>
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

        {/* Company Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            {t("signUpForm.email")}
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder={t("signUpForm.email")}
            className="w-full"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Company Address and Address Line 2 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="addressLine1"
              className="block text-sm font-medium mb-1"
            >
              {t("companySignUpForm.addressLine1")}
            </label>
            <Input
              id="addressLine1"
              name="addressLine1"
              value={formValues.addressLine1}
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
            <label
              htmlFor="addressLine2"
              className="block text-sm font-medium mb-1"
            >
              {t("companySignUpForm.addressLine2")}
            </label>
            <Input
              id="addressLine2"
              name="addressLine2"
              value={formValues.addressLine2}
              onChange={handleChange}
              placeholder={t("companySignUpForm.addressLine2")}
              className="w-full"
            />
          </div>
        </div>

        {/* City, State, Zip */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">
              {t("companySignUpForm.city")}
            </label>
            <Input
              id="city"
              name="city"
              value={formValues.city}
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
            <label htmlFor="state" className="block text-sm font-medium mb-1">
              {t("companySignUpForm.state")}
            </label>
            <Input
              id="state"
              name="state"
              value={formValues.state}
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
            <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
              {t("companySignUpForm.zipCode")}
            </label>
            <Input
              id="zipCode"
              name="zipCode"
              value={formValues.zipCode}
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

        {/* Company Phone */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            {t("companySignUpForm.phone")}
          </label>
          <div className="flex space-x-2">
            <Select
              onValueChange={handleCompanyCountryChange}
              value={companyCountry}
              aria-label={t("companySignUpForm.selectCountry")}
            >
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
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium mb-1">
            {t("companySignUpForm.website")}
          </label>
          <Input
            id="website"
            name="website"
            value={formValues.website}
            onChange={handleChange}
            placeholder={t("companySignUpForm.website")}
            className="w-full"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-start">
          <Button size="sm" type="submit">
            {t("companySignUpForm.updateBtn")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCompanyDetails;
