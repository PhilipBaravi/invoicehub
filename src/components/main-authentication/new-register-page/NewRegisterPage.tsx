import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModeToggle } from '@/components/dashboard/layout/ModeToggle';
import GoogleIcon from '../GoogleIcon';
import AppleIcon from '../AppleIcon';
import { CountryCode, isValidPhoneNumber, getCountryCallingCode } from "libphonenumber-js";
import countryList from "../../account-details/profile-form/CountryCodes";
import { quotes } from '../new-login-page/quotes';
import LanguageSelector from '../new-login-page/LanguageSelector';

const NewRegisterPage = () => {
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [country, setCountry] = useState<CountryCode>("US"); // Default to US
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [randomQuote, setRandomQuote] = useState<{ quote: string, name: string } | null>(null);
  const navigate = useNavigate();

  const phoneCode = `+${getCountryCallingCode(country)}`;

  // Function to get a random quote
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  useEffect(() => {
    setRandomQuote(getRandomQuote());
  }, []);

  // Fetch random nature image from Unsplash
  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        const response = await fetch(
        'https://api.unsplash.com/photos/random?query=nature&orientation=landscape&client_id=Z9VwJLO-4EzeKx0Eu2N4BDcLQyjxNo9bWwiAej4R3fk'
        );
        const data = await response.json();
        setImageUrl(data.urls.regular);
      } catch (error) {
        console.error('Error fetching the image:', error);
      }
    };

    fetchRandomImage();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, password, confirmPassword, firstName, lastName, phoneNumber } = formValues;
    let valid = true;
    const newErrors: any = {};

    // Validate Email
    if (!validateEmail(username)) {
      newErrors.username = "Please enter a valid email address.";
      valid = false;
    }

    // Validate Password
    if (!validatePassword(password)) {
      newErrors.password = "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.";
      valid = false;
    }

    // Validate Confirm Password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    // Validate First Name
    if (!firstName) {
      newErrors.firstName = "First name is required.";
      valid = false;
    }

    // Validate Last Name
    if (!lastName) {
      newErrors.lastName = "Last name is required.";
      valid = false;
    }

    // Validate Phone Number
    const fullPhoneNumber = phoneCode + phoneNumber;
    if (!isValidPhoneNumber(fullPhoneNumber, country)) {
      newErrors.phoneNumber = "Invalid phone number for the selected country.";
      valid = false;
    }

    // If not valid, set errors
    if (!valid) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:9090/api/v1/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            confirmPassword,
            firstName,
            lastName,
            phone: fullPhoneNumber,
          }),
        }
      );

      if (response.ok) {
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        const serverErrors = errorData.errors || {};
        setErrors((prevErrors) => ({ ...prevErrors, ...serverErrors }));
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleCountryChange = (code: CountryCode) => {
    setCountry(code);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    // Real-time validation
    switch (name) {
      case "username":
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: validateEmail(value)
            ? ""
            : "Please enter a valid email address.",
        }));
        break;
      case "password":
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: validatePassword(value)
            ? ""
            : "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
        }));
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword:
            formValues.confirmPassword === value
              ? ""
              : "Passwords do not match.",
        }));
        break;
      case "confirmPassword":
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword:
            value === formValues.password
              ? ""
              : "Passwords do not match.",
        }));
        break;
      case "phoneNumber":
        const fullPhoneNumber = phoneCode + value;
        setErrors((prevErrors) => ({
          ...prevErrors,
          phoneNumber: isValidPhoneNumber(fullPhoneNumber, country)
            ? ""
            : "Invalid phone number for the selected country.",
        }));
        break;
      default:
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: value ? "" : "This field is required.",
        }));
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  return (
    <div className="flex min-h-screen bg-white text-black dark:bg-stone-950 dark:text-stone-200">
      {/* Left side - 60% width */}
      <div className="w-[60%] flex flex-col p-10">
        <div className="text-2xl font-bold">Logo</div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-4xl text-stone-300 dark:text-stone-700">
            {imageUrl ? (
              <img src={imageUrl} alt="Random Nature" className="w-full h-auto object-cover" />
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>

        {randomQuote && (
          <div className="max-w-md">
            <p className="text-lg mb-2">"{randomQuote.quote}"</p>
            <p className="text-stone-600 dark:text-stone-400">{randomQuote.name}</p>
          </div>
        )}
      </div>

      {/* Right side - 40% width */}
      <div className="w-[40%] bg-white dark:bg-stone-900 p-10 flex flex-col justify-center relative">
        <div className="absolute top-4 right-4 flex items-center space-x-4">
          {/* Language Selector */}
         <LanguageSelector />
          <ModeToggle />
        </div>
        <h1 className="text-3xl font-bold mb-2">Create a New Account</h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
          Enter your details to create a new account.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">
              First Name
            </label>
            <Input
              id="firstName"
              name="firstName"
              value={formValues.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full bg-stone-100 border-stone-300 dark:bg-stone-800 dark:border-stone-700"
              required
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">
              Last Name
            </label>
            <Input
              id="lastName"
              name="lastName"
              value={formValues.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full bg-stone-100 border-stone-300 dark:bg-stone-800 dark:border-stone-700"
              required
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              id="username"
              type="email"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              placeholder="name@example.com"
              className="w-full bg-stone-100 border-stone-300 dark:bg-stone-800 dark:border-stone-700"
              required
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          {/* Phone Number Input with Country Code Select */}
          <div className="flex space-x-2">
            <Select onValueChange={handleCountryChange}>
              <SelectTrigger className="w-[120px] bg-white dark:bg-stone-800">
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
  id="phoneNumber"
  type="tel"
  name="phoneNumber"
  value={formValues.phoneNumber} // Only the number part goes here
  onChange={handleChange} // Keep this so user can modify the input
  placeholder={phoneCode} // Show the country code as placeholder
  className="w-full bg-stone-100 border-stone-300 dark:bg-stone-800 dark:border-stone-700"
  required
/>

          </div>
          {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-stone-100 border-stone-300 dark:bg-stone-800 dark:border-stone-700"
              required
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formValues.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-stone-100 border-stone-300 dark:bg-stone-800 dark:border-stone-700"
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="terms" required />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the terms of service and privacy policy
            </label>
          </div>

          {errorMessage && (
            <p className="text-red-600 text-sm">{errorMessage}</p>
          )}

          <Button className="w-full">Sign Up</Button>
        </form>

        <div className="mt-6 pb-6 text-center text-sm text-stone-500 dark:text-stone-400">
          OR CONTINUE WITH
        </div>
        <Button>
          <GoogleIcon />
          Sign Up with Google
        </Button>
        <Button className="mt-4 w-full">
          <AppleIcon />
          Sign Up with Apple
        </Button>

        <p className="mt-6 text-center text-xs text-stone-500 dark:text-stone-400">
          Already have an account?{' '}
          <Link to="/new-login" className="underline hover:text-stone-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default NewRegisterPage;
