import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  isValidPhoneNumber,
  getCountryCallingCode,
  CountryCode,
} from "libphonenumber-js";
import countryList from "../../account-details/profile-form/CountryCodes";

const RegisterPageForm: FC = () => {
  const [username, setUsername] = useState<string>(""); 
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [country, setCountry] = useState<CountryCode>("GE");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  const phoneCode = `+${getCountryCallingCode(country)}`;

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  //Form Validation

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setErrorMessage(
        "პაროლი უნდა შედგებოდეს მინიმუმ 8 სიმბოლოსგან, შეიცავდეს ერთ დიდ ასოს, ერთ პატარა ასოს, ერთ ციფრს და ერთ სპეციალურ სიმბოლოს."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("პაროლები არ ემთხვევა.");
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(username)) {
      setErrorMessage("გთხოვთ, მიუთითოთ სწორი ელ.ფოსტის მისამართი.");
      return;
    }

    const fullPhoneNumber = phoneCode + phoneNumber;
    if (!isValidPhoneNumber(fullPhoneNumber, country)) {
      setErrorMessage("ტელეფონის ნომერი არასწორია არჩეული ქვეყნისთვის.");
      return;
    }

    setErrorMessage("");

    //Send data to back

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
        navigate("/email-verification");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "სერვერული შეცდომა მოხდა.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("ქსელური შეცდომა, გთხოვთ სცადოთ მოგვიანებით.");
      }
    }
  };

  return (
    <div className="w-[100%] mt-[30px] flex flex-col justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-start gap-[0.5rem] w-[90%]"
      >
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="სახელი*"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black font-georgian text-lg"
          required
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="გვარი*"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black font-georgian text-lg"
          required
        />
        <input
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ელ.ფოსტა"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black font-georgian text-lg"
          required
        />
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
        <div className="w-full flex items-center">
          <input
            type="text"
            value={phoneCode}
            readOnly
            className="w-[70px] p-3 border border-gray-300 rounded-l-lg focus:outline-none text-white bg-brightBlue cursor-not-allowed font-georgian"
          />
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="ტელეფონის ნომერი*"
            className="w-full p-3 border border-gray-300 rounded-r-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black font-georgian text-lg"
            required
          />
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="პაროლი*"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black font-georgian text-lg"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="დაადასტურეთ პაროლი*"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black font-georgian text-lg"
          required
        />
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2 w-full font-georgian">
            {errorMessage}
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
