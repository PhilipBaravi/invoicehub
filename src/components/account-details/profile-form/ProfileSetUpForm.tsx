import { FC, useState } from "react";
import { isValidPhoneNumber, getCountryCallingCode, CountryCode } from "libphonenumber-js";
import countryList from "./CountryCodes"; // Object for countries
import AuthButton from "../../main-authentication/AuthButton";

const ProfileSetUpForm: FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [country, setCountry] = useState<CountryCode>("GE"); // Default
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [howHeard, setHowHeard] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Get the phone code for the selected country
  const phoneCode = `+${getCountryCallingCode(country)}`;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const fullPhoneNumber = phoneCode + phoneNumber; 

    if (!isValidPhoneNumber(fullPhoneNumber, country)) {
      setErrorMessage("Invalid phone number for the selected country.");
      return;
    }

    setErrorMessage("");
    console.log("Form Submitted:", { firstName, lastName, country, phoneNumber: fullPhoneNumber, howHeard });
  };

  return (
    <div className="w-[90%] flex flex-col items-start mt-[1.5rem]">
      <form 
        className="flex flex-col items-start gap-[0.5rem] w-full" 
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>); // Explicitly call the submit handler
          }
        }}
      >
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name*"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black font-georgian text-lg"
          required
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last name*"
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
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
        <div className="w-full flex items-center">
          <input
            type="text"
            value={phoneCode}
            readOnly
            className="w-[70px] p-3 border border-gray-300 rounded-l-lg focus:outline-none text-black bg-gray-200 cursor-not-allowed"
          />
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number*"
            className="w-full p-3 border border-gray-300 rounded-r-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black font-georgian text-lg"
            required
          />
        </div>

        <select
          value={howHeard}
          onChange={(e) => setHowHeard(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black font-georgian text-lg"
          required
        >
          <option value="">How did you hear about us?</option>
          <option value="Web search">Web search (e.g., Google)</option>
          <option value="Social media">Social media</option>
          <option value="Friend">Friend</option>
          <option value="Advertisement">Advertisement</option>
        </select>

        {errorMessage && <p className="text-red-500 text-sm mt-2 w-[75%]">{errorMessage}</p>}
        
        <AuthButton authButtonText='Next'/>
      </form>
    </div>
  );
};

export default ProfileSetUpForm;
