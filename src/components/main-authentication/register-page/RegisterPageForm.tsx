import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  isValidPhoneNumber,
  getCountryCallingCode,
  CountryCode,
} from "libphonenumber-js";
import countryList from "../../account-details/profile-form/CountryCodes";

const RegisterPageForm: FC = () => {
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [country, setCountry] = useState<CountryCode>("GE");
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const navigate = useNavigate();

  const phoneCode = `+${getCountryCallingCode(country)}`;

  const validateEmail = (email: string) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
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
            : "გთხოვთ, მიუთითოთ სწორი ელ.ფოსტის მისამართი.",
        }));
        break;
      case "password":
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: validatePassword(value)
            ? ""
            : "პაროლი უნდა შედგებოდეს მინიმუმ 8 სიმბოლოსგან, შეიცავდეს ერთ დიდ ასოს, ერთ პატარა ასოს, ერთ ციფრს და ერთ სპეციალურ სიმბოლოს.",
        }));
        // Also check confirm password match when password changes
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword:
            formValues.confirmPassword === value
              ? ""
              : "პაროლები არ ემთხვევა.",
        }));
        break;
      case "confirmPassword":
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword:
            value === formValues.password
              ? ""
              : "პაროლები არ ემთხვევა.",
        }));
        break;
      case "phoneNumber":
        const fullPhoneNumber = phoneCode + value;
        setErrors((prevErrors) => ({
          ...prevErrors,
          phoneNumber: isValidPhoneNumber(fullPhoneNumber, country)
            ? ""
            : "ტელეფონის ნომერი არასწორია არჩეული ქვეყნისთვის.",
        }));
        break;
      default:
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: value ? "" : "ველი სავალდებულოა.",
        }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Final validation before submission
    const { username, password, confirmPassword, firstName, lastName, phoneNumber } = formValues;
    let valid = true;
    const newErrors: any = {};

    if (!validateEmail(username)) {
      newErrors.username = "გთხოვთ, მიუთითოთ სწორი ელ.ფოსტის მისამართი.";
      valid = false;
    }

    if (!validatePassword(password)) {
      newErrors.password =
        "პაროლი უნდა შედგებოდეს მინიმუმ 8 სიმბოლოსგან, შეიცავდეს ერთ დიდ ასოს, ერთ პატარა ასოს, ერთ ციფრს და ერთ სპეციალურ სიმბოლოს.";
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "პაროლები არ ემთხვევა.";
      valid = false;
    }

    if (!firstName) {
      newErrors.firstName = "სახელი სავალდებულოა.";
      valid = false;
    }

    if (!lastName) {
      newErrors.lastName = "გვარი სავალდებულოა.";
      valid = false;
    }

    const fullPhoneNumber = phoneCode + phoneNumber;
    if (!isValidPhoneNumber(fullPhoneNumber, country)) {
      newErrors.phoneNumber = "ტელეფონის ნომერი არასწორია არჩეული ქვეყნისთვის.";
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    setErrors({
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    });

    // Send data to backend
    try {
      const response = await fetch(
        "http://localhost:9090/api/v1/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
            confirmPassword: confirmPassword,
            firstName: firstName,
            lastName: lastName,
            phone: fullPhoneNumber,
          }),
        }
      );

      if (response.ok) {
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        // Handle server-side validation errors if provided
        const serverErrors = errorData.errors || {};
        setErrors((prevErrors) => ({ ...prevErrors, ...serverErrors }));
      }
    } catch (error: unknown) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="w-[100%] mt-[30px] flex flex-col justify-center items-center py-[30px]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-start gap-[0.5rem] w-[90%]"
      >
        <input
          type="text"
          name="firstName"
          value={formValues.firstName}
          onChange={handleChange}
          placeholder="სახელი*"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black font-georgian text-lg"
          required
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm mt-1 font-georgian">
            {errors.firstName}
          </p>
        )}

        <input
          type="text"
          name="lastName"
          value={formValues.lastName}
          onChange={handleChange}
          placeholder="გვარი*"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black font-georgian text-lg"
          required
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm mt-1 font-georgian">
            {errors.lastName}
          </p>
        )}

        <input
          type="email"
          name="username"
          value={formValues.username}
          onChange={handleChange}
          placeholder="ელ.ფოსტა*"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black font-georgian text-lg"
          required
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1 font-georgian">
            {errors.username}
          </p>
        )}

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value as CountryCode)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black font-georgian text-lg"
          required
        >
          {countryList.map((c) => (
            <option key={c.code} value={c.code} className="font-georgian">
              {c.name}
            </option>
          ))}
        </select>

        <div className="w-full flex flex-col">
          <div className="flex items-center">
            <input
              type="text"
              value={phoneCode}
              readOnly
              className="w-[70px] p-3 border border-gray-300 rounded-l-lg focus:outline-none text-white bg-brightBlue cursor-not-allowed font-georgian"
            />
            <input
              type="tel"
              name="phoneNumber"
              value={formValues.phoneNumber}
              onChange={handleChange}
              placeholder="ტელეფონის ნომერი*"
              className="w-full p-3 border border-gray-300 rounded-r-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black font-georgian text-lg"
              required
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1 font-georgian">
              {errors.phoneNumber}
            </p>
          )}
        </div>

        <input
          type="password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
          placeholder="პაროლი*"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black font-georgian text-lg"
          required
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1 font-georgian">
            {errors.password}
          </p>
        )}

        <input
          type="password"
          name="confirmPassword"
          value={formValues.confirmPassword}
          onChange={handleChange}
          placeholder="დაადასტურეთ პაროლი*"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black font-georgian text-lg"
          required
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1 font-georgian">
            {errors.confirmPassword}
          </p>
        )}

        <button
          type="submit"
          className="w-full p-3 bg-brightBlue text-white rounded-lg mt-4 font-georgian text-lg"
        >
          რეგისტრაცია
        </button>
      </form>
    </div>
  );
};

export default RegisterPageForm;
