import { CountryCode } from "libphonenumber-js";

type CountryListProps = {
    name: string;
    code: CountryCode; // CountryCode from libphonenumber-js
  };
  
  const countryList: CountryListProps[] = [
    { name: "Georgia", code: "GE" },
    { name: "United States", code: "US" },
    { name: "Germany", code: "DE" },
    { name: "Spain", code: "ES" },
    { name: "France", code: "FR" },
    { name: "United Kingdom", code: "GB" },
  ];

  export default countryList