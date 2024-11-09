import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CountryCode, getCountryCallingCode, isValidPhoneNumber } from 'libphonenumber-js';
import countryList from "../../account-details/profile-form/CountryCodes";
import { useTranslation } from 'react-i18next';

interface RegisterFormProps {
  setUserDetails: (details: UserFormValues) => void;
}

interface UserFormValues {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ setUserDetails }) => {
  const { t } = useTranslation();
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
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, password, confirmPassword, firstName, lastName, phone } = formValues;
    let valid = true;
    const newErrors: any = {};

    // Validation logic
    if (!validateEmail(username)) {
      newErrors.username = t('signUpForm.errors.validateEmail')
      valid = false;
    }

    if (!validatePassword(password)) {
      newErrors.password = t('signUpForm.errors.validatePassword')
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = t('signUpForm.errors.confirmPassword')
      valid = false;
    }

    if (!firstName) {
      newErrors.firstName = t('signUpForm.errors.firstName')
      valid = false;
    }

    if (!lastName) {
      newErrors.lastName = t('signUpForm.errors.lastName')
      valid = false;
    }

    const fullPhoneNumber = phoneCode + phone;
    if (!isValidPhoneNumber(fullPhoneNumber, country)) {
      newErrors.phone = t('signUpForm.errors.phone')
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    // Pass user details to parent component and navigate to company registration form
    setUserDetails({
      username,
      password,
      confirmPassword,
      firstName,
      lastName,
      phone: fullPhoneNumber,
    });
    navigate("/company-registration");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleCountryChange = (code: CountryCode) => setCountry(code);

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              id="firstName"
              name="firstName"
              value={formValues.firstName}
              onChange={handleChange}
              placeholder={t('signUpForm.firstName')}
              className="w-full"
              required
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </div>
          <div>
            <Input
              id="lastName"
              name="lastName"
              value={formValues.lastName}
              onChange={handleChange}
              placeholder={t('signUpForm.lastName')}
              className="w-full"
              required
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
          </div>
        </div>

        {/* Email */}
        <div>
          <Input
            id="username"
            type="email"
            name="username"
            value={formValues.username}
            onChange={handleChange}
            placeholder={t('signUpForm.email')}
            className="w-full"
            required
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
        </div>

        {/* Phone Number */}
        <div className="flex space-x-2">
          <Select onValueChange={handleCountryChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={countryList.find((c) => c.code === country)?.name || t('signUpForm.selectCountry')} />
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

        {/* Password & Confirm Password */}
        <div>
          <Input
            id="password"
            type="password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
            placeholder={t('signUpForm.password')}
            className="w-full"
            required
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>
        <div>
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formValues.confirmPassword}
            onChange={handleChange}
            placeholder={t('signUpForm.confirmPassword')}
            className="w-full"
            required
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
        </div>

        {/* Sign Up Button */}
        <Button className="w-full">{t('signUpForm.companyInfo')}</Button>
      </form>

      {/* Login Redirect */}
      <p className="mt-6 text-center text-xs text-stone-500 dark:text-stone-400">
        {t('signUpForm.haveAnAccount')}{' '}
        <Link to="/new-login" className="underline hover:text-stone-300">
          {t('signUpForm.login')}
        </Link>
      </p>
    </>
  );
};

export default RegisterForm;
