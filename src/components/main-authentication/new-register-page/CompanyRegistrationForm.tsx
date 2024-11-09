import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CountryCode, getCountryCallingCode, isValidPhoneNumber } from 'libphonenumber-js';
import countryList from "../../account-details/profile-form/CountryCodes";
import { apiFetch } from '@/utils/api';
import { useTranslation } from 'react-i18next';

interface CompanyRegistrationFormProps {
  userDetails: UserFormValues | null;
}

interface UserFormValues {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

const CompanyRegistrationForm: React.FC<CompanyRegistrationFormProps> = ({ userDetails }) => {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState({
    title: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    website: '',
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
  const navigate = useNavigate();
  const companyPhoneCode = `+${getCountryCallingCode(companyCountry)}`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { title, addressLine1, addressLine2, city, state, zipCode, phone, website } = formValues;

    let valid = true;
    const newErrors: any = {};

    // Validation logic
    if (!title) {
      newErrors.title = t('companySignUpForm.errors.companyName');
      valid = false;
    }

    const fullCompanyPhoneNumber = companyPhoneCode + phone;
    if (!isValidPhoneNumber(fullCompanyPhoneNumber, companyCountry)) {
      newErrors.phone = t('companySignUpForm.errors.companyPhone');
      valid = false;
    }

    if (!addressLine1) {
      newErrors.addressLine1 = t('companySignUpForm.errors.companyAddress');
      valid = false;
    }

    if (!city) {
      newErrors.city = t('companySignUpForm.errors.companyCity')
      valid = false;
    }

    if (!state) {
      newErrors.state = t('companySignUpForm.errors.companyState');
      valid = false;
    }

    if (!zipCode) {
      newErrors.zipCode = t('companySignUpForm.errors.zipCode');
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    // Combine user details and company details
    const completeRegistrationData = {
      ...userDetails,
      company: {
        title,
        phone: fullCompanyPhoneNumber,
        website,
        address: {
          addressLine1,
          addressLine2,
          city,
          state,
          country: companyCountry,
          zipCode,
        },
      },
    };

    try {
      // Sending the combined data using apiFetch
      const response = await apiFetch('http://localhost:9090/api/v1/user/create', {
        method: 'POST',
        body: JSON.stringify(completeRegistrationData),
      });

      console.log('Registration successful!', response);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleCompanyCountryChange = (code: CountryCode) => setCompanyCountry(code);

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Company Name */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          {t('companySignUpForm.companyName')}
        </label>
        <Input
          id="title"
          name="title"
          value={formValues.title}
          onChange={handleChange}
          placeholder={t('companySignUpForm.companyName')}
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
            placeholder={t('companySignUpForm.addressLine1')}
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
            placeholder={t('companySignUpForm.addressLine2')}
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
            placeholder={t('companySignUpForm.city')}
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
            placeholder={t('companySignUpForm.state')}
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
            placeholder={t('companySignUpForm.zipCode')}
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
            <SelectValue placeholder={countryList.find((c) => c.code === companyCountry)?.name || t('companySignUpForm.selectCountry')} />
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
          placeholder={t('companySignUpForm.website')}
          className="w-full"
        />
      </div>
      <Button className="w-full">{t('companySignUpForm.submitBtn')}</Button>
    </form>
  );
};

export default CompanyRegistrationForm;
