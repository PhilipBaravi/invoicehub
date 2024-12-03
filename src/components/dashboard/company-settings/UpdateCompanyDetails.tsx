import  { useState, FC } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CountryCode, getCountryCallingCode, isValidPhoneNumber } from 'libphonenumber-js';
import countryList from "../../account-details/profile-form/CountryCodes";
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('settings');
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
      newErrors.title = t('company.errors.name');
      valid = false;
    }
  
    const fullCompanyPhoneNumber = companyPhoneCode + phone;
    if (!isValidPhoneNumber(fullCompanyPhoneNumber, companyCountry)) {
      newErrors.phone = t('company.errors.phone');
      valid = false;
    }
  
    if (!addressLine1) {
      newErrors.addressLine1 = t('company.errors.address');
      valid = false;
    }
  
    if (!city) {
      newErrors.city = t('company.errors.city');
      valid = false;
    }
  
    if (!state) {
      newErrors.state = t('company.errors.state');
      valid = false;
    }
  
    if (!zipCode) {
      newErrors.zipCode = t('company.errors.zip');
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
          {t('company.title')}
        </label>
        <Input
          id="title"
          name="title"
          value={formValues.title}
          onChange={handleChange}
          placeholder={t('company.title')}
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
            placeholder={t('company.address1')}
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
            placeholder={t('company.address2')}
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
            placeholder={t('company.city')}
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
            placeholder={t('company.state')}
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
            placeholder={t('company.zip')}
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
            <SelectValue placeholder={countryList.find((c) => c.code === companyCountry)?.name || t('company.selectCountry')} />
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
          placeholder={t('company.website')}
          className="w-full"
        />
      </div>
      <Button onClick={handleSubmit}>{t('company.save')}</Button>
    </form>
    </div>
  );
};

export default UpdateCompanyDetails;
