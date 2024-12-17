import React, { useState, useEffect, FC } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CountryCode,
  getCountryCallingCode,
  isValidPhoneNumber,
} from 'libphonenumber-js';
import countryList from '../../account-details/profile-form/CountryCodes';
import { useTranslation } from 'react-i18next';
import { useKeycloak } from '@react-keycloak/web';
import { useToast } from '@/hooks/use-toast';

interface Address {
  id: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface Company {
  id: number;
  title: string;
  phone: string;
  website: string;
  email: string;
  address: Address;
}

interface Role {
  description: string;
}

interface User {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfEmployment: string;
  enabled: boolean;
  company: Company;
  role: Role;
}

const UpdateUserSettings: FC = () => {
  const { keycloak } = useKeycloak();
  const { t } = useTranslation();
  const [userId, setUserId] = useState<number | null>(null);
  const { toast } = useToast();

  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const [phoneCountry, setPhoneCountry] = useState<CountryCode>('US');
  const [errors, setErrors] = useState<{
    password?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  }>({});

  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [roleDescription, setRoleDescription] = useState<string>('');

  const phoneCode = `+${getCountryCallingCode(phoneCountry)}`;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          'https://api.invoicehub.space/api/v1/user/loggedInUser',
          {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const user: User = data.data;
          setUserId(user.id);

          setFormValues({
            username: user.username || '',
            password: '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            phone: user.phone.replace(/^\+\d{1,3}/, '') || '',
          });

          const countryCode = countryList.find((c) =>
            user.phone.startsWith(`+${getCountryCallingCode(c.code)}`)
          )?.code;
          if (countryCode) setPhoneCountry(countryCode as CountryCode);

          setCompanyData(user.company);
          setRoleDescription(user.role.description);
        } else {
          console.error('Failed to fetch user data');
          toast({
            title: t('form.error'),
            description: t('form.fetchUserError'),
            variant: 'destructive',
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: t('form.error'),
          description: t('form.fetchUserError'),
          variant: 'destructive',
          duration: 3000,
        });
      }
    };

    fetchUserData();
  }, [keycloak.token, t, toast]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    const { password, firstName, lastName, phone, username } = formValues;
    let valid = true;
    const newErrors: {
      password?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
    } = {};

    // First Name
    if (!firstName.trim()) {
      newErrors.firstName = t('signUpForm.errors.firstName');
      valid = false;
    }

    // Last Name
    if (!lastName.trim()) {
      newErrors.lastName = t('signUpForm.errors.lastName');
      valid = false;
    }

    // Phone Number
    const fullPhoneNumber = `${phoneCode}${phone.trim()}`;
    if (!isValidPhoneNumber(fullPhoneNumber, phoneCountry)) {
      newErrors.phone = t('signUpForm.errors.phone');
      valid = false;
    }

    // Password if it's provided
    if (password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^_-])[A-Za-z\d@$!%*#?&^_-]{8,}$/;
      if (!passwordRegex.test(password.trim())) {
        newErrors.password = t('signUpForm.errors.validatePassword');
        valid = false;
      }
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    if (!companyData) {
      toast({
        title: t('form.error'),
        description: t('form.companyDataMissing'),
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }

    try {
      const response = await fetch(
        `https://api.invoicehub.space/api/v1/user/update/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keycloak.token}`,
          },
          body: JSON.stringify({
            username: username,
            password: password.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: fullPhoneNumber,
            company: {
              id: companyData.id,
              title: companyData.title,
              phone: companyData.phone,
              website: companyData.website,
              email: companyData.email,
              address: {
                id: companyData.address.id,
                addressLine1: companyData.address.addressLine1,
                addressLine2: companyData.address.addressLine2,
                city: companyData.address.city,
                state: companyData.address.state,
                country: companyData.address.country,
                zipCode: companyData.address.zipCode,
              },
            },
            role: {
              description: roleDescription, 
            },
          }),
        }
      );

      if (response.ok) {
        console.log('User details updated successfully');
        toast({
          title: t('form.success'),
          description: t('form.userUpdateSuccess'),
          variant: 'success',
          duration: 3000,
        });
        setErrors({});
      } else {
        console.error('Failed to update user details');
        toast({
          title: t('form.error'),
          description: t('form.userUpdateError'),
          variant: 'destructive',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error updating user details:', error);
      toast({
        title: t('form.error'),
        description: t('form.userUpdateError'),
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));

    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  };

  const handlePhoneCountryChange = (code: CountryCode) => {
    setPhoneCountry(code);
    // Re-validate phone number when country changes
    if (formValues.phone) {
      const fullPhoneNumber = `+${getCountryCallingCode(code)}${formValues.phone.trim()}`;
      if (isValidPhoneNumber(fullPhoneNumber, code)) {
        setErrors((prevErrors) => ({ ...prevErrors, phone: undefined }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phone: t('signUpForm.errors.phone'),
        }));
      }
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Email and Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium mb-1"
          >
            {t('signUpForm.email')}
          </label>
          <Input
            id="username"
            name="username"
            value={formValues.username}
            placeholder={t('signUpForm.email')}
            readOnly
            className="w-full bg-gray-100 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-1"
          >
            {t('signUpForm.password')}
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleChange}
            placeholder={t('signUpForm.password')}
            className="w-full"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
      </div>

      {/* First Name, Last Name, and Phone */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium mb-1"
          >
            {t('signUpForm.firstName')}
          </label>
          <Input
            id="firstName"
            name="firstName"
            value={formValues.firstName}
            onChange={handleChange}
            placeholder={t('signUpForm.firstName')}
            className="w-full"
            required
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium mb-1"
          >
            {t('signUpForm.lastName')}
          </label>
          <Input
            id="lastName"
            name="lastName"
            value={formValues.lastName}
            onChange={handleChange}
            placeholder={t('signUpForm.lastName')}
            className="w-full"
            required
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium mb-1"
          >
            {t('signUpForm.phone')}
          </label>
          <div className="flex space-x-2">
            <Select
              onValueChange={handlePhoneCountryChange}
              value={phoneCountry}
              aria-label={t('signUpForm.selectCountry')}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue
                  placeholder={
                    countryList.find((c) => c.code === phoneCountry)?.name ||
                    t('signUpForm.selectCountry')
                  }
                />
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
              placeholder={phoneCode}
              className="w-full"
              required
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-start">
        <Button size="sm" className="mt-2" type="submit">
          {t('companySignUpForm.updateBtn')}
        </Button>
      </div>
    </form>
  );
};

export default UpdateUserSettings;
