import { FC, useState } from "react";
import { isValidPhoneNumber, getCountryCallingCode, CountryCode } from "libphonenumber-js";
import countryList from "./CountryCodes"; // Object for countries
import AuthButton from "../../main-authentication/AuthButton";

const ProfileSetUpForm: FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [country, setCountry] = useState<CountryCode>("GE"); // Default to Georgia
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [howHeard, setHowHeard] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Get the phone code for the selected country
  const phoneCode = `+${getCountryCallingCode(country)}`;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const fullPhoneNumber = phoneCode + phoneNumber; 

    if (!isValidPhoneNumber(fullPhoneNumber, country)) {
      setErrorMessage("ტელეფონის ნომერი არასწორია არჩეული ქვეყნისთვის."); // Invalid phone number message
      return;
    }

    setErrorMessage(""); // Clear error message
    console.log("ფორმა წარმატებით გაიგზავნა:", { firstName, lastName, country, phoneNumber: fullPhoneNumber, howHeard });
  };

  return (
    <div className="w-[90%] flex flex-col items-start mt-[1.5rem]">
      <form className="flex flex-col items-start gap-[0.5rem] w-full" onSubmit={handleSubmit}>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="სახელი*" // First name*
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brightBlue transition-all duration-300 text-black font-georgian text-lg"
          required
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="გვარი*" // Last name*
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
            className="w-[70px] p-3 border border-gray-300 rounded-l-lg focus:outline-none text-black bg-gray-200 cursor-not-allowed font-georgian"
          />
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="ტელეფონის ნომერი*" // Phone number*
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
          <option value="" className="font-georgian">როგორ გაიგეთ ჩვენზე?</option> {/* How did you hear about us? */}
          <option value="Web search" className="font-georgian">ვებ ძიება (მაგ., Google)</option> {/* Web search */}
          <option value="Social media" className="font-georgian">სოციალური მედია</option> {/* Social media */}
          <option value="Friend" className="font-georgian">მეგობარი</option> {/* Friend */}
          <option value="Advertisement" className="font-georgian">რეკლამა</option> {/* Advertisement */}
        </select>

        {errorMessage && <p className="text-red-500 text-sm mt-2 w-[75%] font-georgian">{errorMessage}</p>} {/* Error message for phone number */}
        
        <AuthButton authButtonText="შემდეგი" /> {/* Next in Georgian */}
      </form>
    </div>
  );
};

export default ProfileSetUpForm;
