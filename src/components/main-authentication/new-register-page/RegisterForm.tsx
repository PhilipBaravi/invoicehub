import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CountryCode, getCountryCallingCode, isValidPhoneNumber } from 'libphonenumber-js';
import countryList from "../../account-details/profile-form/CountryCodes";

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
      newErrors.username = "Please enter a valid email address.";
      valid = false;
    }

    if (!validatePassword(password)) {
      newErrors.password = "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.";
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    if (!firstName) {
      newErrors.firstName = "First name is required.";
      valid = false;
    }

    if (!lastName) {
      newErrors.lastName = "Last name is required.";
      valid = false;
    }

    const fullPhoneNumber = phoneCode + phone;
    if (!isValidPhoneNumber(fullPhoneNumber, country)) {
      newErrors.phone = "Invalid phone number for the selected country.";
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
              placeholder="First Name"
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
              placeholder="Last Name"
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
            placeholder="Email"
            className="w-full"
            required
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
        </div>

        {/* Phone Number */}
        <div className="flex space-x-2">
          <Select onValueChange={handleCountryChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={countryList.find((c) => c.code === country)?.name || 'Select country'} />
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
            placeholder="Password"
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
            placeholder="Confirm Password"
            className="w-full"
            required
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
        </div>

        {/* Sign Up Button */}
        <Button className="w-full">Next: Company Info</Button>
      </form>

      {/* Login Redirect */}
      <p className="mt-6 text-center text-xs text-stone-500 dark:text-stone-400">
        Already have an account?{' '}
        <Link to="/new-login" className="underline hover:text-stone-300">
          Login
        </Link>
      </p>
    </>
  );
};

export default RegisterForm;
