import  { useState, FC } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CountryCode, getCountryCallingCode, isValidPhoneNumber } from 'libphonenumber-js';
import countryList from "../../account-details/profile-form/CountryCodes";
import { Button } from '@/components/ui/button';

interface UpdateCompanyDetailsProps {
  initialValues?: {
    title: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    website: string;
  };
}

const UpdateCompanyDetails: FC<UpdateCompanyDetailsProps> = ({ initialValues }) => {
  const [formValues, setFormValues] = useState({
    title: initialValues?.title || '',
    addressLine1: initialValues?.addressLine1 || '',
    addressLine2: initialValues?.addressLine2 || '',
    city: initialValues?.city || '',
    state: initialValues?.state || '',
    zipCode: initialValues?.zipCode || '',
    phone: initialValues?.phone || '',
    website: initialValues?.website || '',
  });
  const [companyCountry, setCompanyCountry] = useState<CountryCode>('US');
  const [errors, setErrors] = useState({
    title: '',
    addressLine1: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

  const companyPhoneCode = `+${getCountryCallingCode(companyCountry)}`;

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
    }
  
    const { title, addressLine1, city, state, zipCode, phone} = formValues;
  
    let valid = true;
    const newErrors: any = {};
  
    // Validations
    if (!title) {
      newErrors.title = 'Company name is required.';
      valid = false;
    }
  
    const fullCompanyPhoneNumber = companyPhoneCode + phone;
    if (!isValidPhoneNumber(fullCompanyPhoneNumber, companyCountry)) {
      newErrors.phone = 'Invalid company phone number for the selected country.';
      valid = false;
    }
  
    if (!addressLine1) {
      newErrors.addressLine1 = 'Company address is required.';
      valid = false;
    }
  
    if (!city) {
      newErrors.city = 'City is required.';
      valid = false;
    }
  
    if (!state) {
      newErrors.state = 'State is required.';
      valid = false;
    }
  
    if (!zipCode) {
      newErrors.zipCode = 'Zip code is required.';
      valid = false;
    }
  
    if (!valid) {
      setErrors(newErrors);
      return;
    }
  
    // API endpoint will be added later
    console.log('Form is valid, ready for submission.');
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleCompanyCountryChange = (code: CountryCode) => setCompanyCountry(code);

  return (
    <div className='px-4'>
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Company Name */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Company Name
        </label>
        <Input
          id="title"
          name="title"
          value={formValues.title}
          onChange={handleChange}
          placeholder="Company Name"
          className="w-full"
          required
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      {/* Company Address and Address Line 2 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            id="addressLine1"
            name="addressLine1"
            value={formValues.addressLine1}
            onChange={handleChange}
            placeholder="Address Line 1"
            className="w-full"
            required
          />
          {errors.addressLine1 && <p className="text-red-500 text-sm">{errors.addressLine1}</p>}
        </div>
        <div>
          <Input
            id="addressLine2"
            name="addressLine2"
            value={formValues.addressLine2}
            onChange={handleChange}
            placeholder="Address Line 2 (Optional)"
            className="w-full"
          />
        </div>
      </div>

      {/* City, State, Zip */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Input
            id="city"
            name="city"
            value={formValues.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full"
            required
          />
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
        </div>
        <div>
          <Input
            id="state"
            name="state"
            value={formValues.state}
            onChange={handleChange}
            placeholder="State"
            className="w-full"
            required
          />
          {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
        </div>
        <div>
          <Input
            id="zipCode"
            name="zipCode"
            value={formValues.zipCode}
            onChange={handleChange}
            placeholder="Zip Code"
            className="w-full"
            required
          />
          {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
        </div>
      </div>

      {/* Company Phone */}
      <div className="flex space-x-2">
        <Select onValueChange={handleCompanyCountryChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={countryList.find((c) => c.code === companyCountry)?.name || 'Select country'} />
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

      {/* Website */}
      <div>
        <Input
          id="website"
          name="website"
          value={formValues.website}
          onChange={handleChange}
          placeholder="Company Website (Optional)"
          className="w-full"
        />
      </div>
      <Button onClick={handleSubmit}>Save</Button>
    </form>
    </div>
  );
};

export default UpdateCompanyDetails;
