import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import countryList from '@/components/account-details/profile-form/CountryCodes';
import { Employee } from './employeeTypes';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useKeycloak } from '@react-keycloak/web';
import { useTranslation } from 'react-i18next';

// Types for errors
type EmployeeErrors = {
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export default function AddEmployeeSheet({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { keycloak } = useKeycloak();
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id'>>({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: { description: 'Employee' },
    dateOfEmployment: new Date(),
    status: 'INACTIVE',
  });

  const { t } = useTranslation('employees')
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>('US');
  const [errors, setErrors] = useState<EmployeeErrors>({});
  const phoneCode = `+${getCountryCallingCode(phoneCountry)}`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    const newErrors: EmployeeErrors = {};

    // Validation
    if (!newEmployee.username) {
      newErrors.username = t('addValidation.employee');
      valid = false;
    }
    if (!newEmployee.password) {
      newErrors.password = t('addValidation.password');
      valid = false;
    }
    if (!newEmployee.firstName) {
      newErrors.firstName = t('addValidation.firstName');
      valid = false;
    }
    if (!newEmployee.lastName) {
      newErrors.lastName = t('addValidation.lastName');
      valid = false;
    }
    const fullPhoneNumber = phoneCode + newEmployee.phone;
    if (!isValidPhoneNumber(fullPhoneNumber, phoneCountry)) {
      newErrors.phone = t('addValidation.phone');
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    const completeEmployeeData = {
      ...newEmployee,
      phone: fullPhoneNumber,
      dateOfEmployment: newEmployee.dateOfEmployment.toISOString().split('T')[0],
    };

    try {
      const response = await fetch('https://api.invoicehub.space/api/v1/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: JSON.stringify(completeEmployeeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error adding employee:', errorData);
        return;
      }

      // Close the sheet and reset the form
      onOpenChange(false);
      setNewEmployee({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: { description: 'Employee' },
        dateOfEmployment: new Date(),
        status: 'INACTIVE',
      });
      setErrors({});
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button>{t('addEmployee.addEmployee')}</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t('addEmployee.addNewEmployee')}</SheetTitle>
          <SheetDescription>{t('addEmployee.details')}</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} id='addEmployeeForm' className="space-y-4 mt-4">
          <div>
            <Label htmlFor="username">{t('addEmployee.email')}</Label>
            <Input
              id="username"
              name="username"
              type="email"
              value={newEmployee.username}
              onChange={handleInputChange}
              required
              autoComplete="email"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>
          <div className="relative">
            <Label htmlFor="password">{t('addEmployee.password')}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={newEmployee.password}
              onChange={handleInputChange}
              required
              autoComplete="new-password"
              className="pr-10"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div>
            <Label htmlFor="firstName">{t('addEmployee.firstName')}</Label>
            <Input
              id="firstName"
              name="firstName"
              value={newEmployee.firstName}
              onChange={handleInputChange}
              required
              autoComplete="given-name"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </div>
          <div>
            <Label htmlFor="lastName">{t('addEmployee.lastName')}</Label>
            <Input
              id="lastName"
              name="lastName"
              value={newEmployee.lastName}
              onChange={handleInputChange}
              required
              autoComplete="family-name"
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
          </div>
          <div className="flex space-x-2">
            <Select onValueChange={(value) => setPhoneCountry(value as CountryCode)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={countryList.find((c) => c.code === phoneCountry)?.name || 'Select country'} />
              </SelectTrigger>
              <SelectContent>
                {countryList.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className='flex flex-col items-center'>
              <Input
                id="phone"
                name="phone"
                value={newEmployee.phone}
                onChange={handleInputChange}
                placeholder={phoneCode}
                className="w-full"
                required
                autoComplete="tel"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="role">{t('addEmployee.role')}</Label>
            <Select
              value={newEmployee.role.description}
              onValueChange={(value) => setNewEmployee((prev) => ({ ...prev, role: { description: value as 'Admin' | 'Manager' | 'Employee' }}))}
            >
              <SelectTrigger id='role'>
                <SelectValue placeholder={t('addEmployee.selectRole')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Employee">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dateOfEmployment">{t('addEmployee.dateOfEmployment')}</Label>
            <Popover>
              <PopoverTrigger asChild id='dateOfEmployment'>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newEmployee.dateOfEmployment ? format(newEmployee.dateOfEmployment, 'PPP') : <span>{t('addEmployee.pirckADate')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={newEmployee.dateOfEmployment}
                  onSelect={(date) => setNewEmployee((prev) => ({ ...prev, dateOfEmployment: date || new Date() }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button type="submit">{t('addEmployee.addEmployee')}</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
