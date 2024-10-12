import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CountryCode, getCountryCallingCode, isValidPhoneNumber } from 'libphonenumber-js';
import countryList from '@/components/account-details/profile-form/CountryCodes';
import { Employee } from './employeeTypes';
import axios from 'axios';

export default function AddEmployeeSheet({
  isOpen,
  onOpenChange,
  onAddEmployee,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
}) {
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
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>('US');
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const phoneCode = `+${getCountryCallingCode(phoneCountry)}`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    const newErrors: any = {};

    // Validation
    if (!newEmployee.username) {
      newErrors.username = 'Email is required.';
      valid = false;
    }
    if (!newEmployee.password) {
      newErrors.password = 'Password is required.';
      valid = false;
    }
    if (!newEmployee.firstName) {
      newErrors.firstName = 'First name is required.';
      valid = false;
    }
    if (!newEmployee.lastName) {
      newErrors.lastName = 'Last name is required.';
      valid = false;
    }
    const fullPhoneNumber = phoneCode + newEmployee.phone;
    if (!isValidPhoneNumber(fullPhoneNumber, phoneCountry)) {
      newErrors.phone = 'Invalid phone number for the selected country.';
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    const completeEmployeeData = {
      ...newEmployee,
      phone: fullPhoneNumber,
    };

    console.log('Employee Data to Submit:', completeEmployeeData);

    // Send the data via POST request using axios
    try {
      await axios.post('http://localhost:9090/api/v1/user/create', completeEmployeeData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Add employee to the list
      onAddEmployee(completeEmployeeData);
      onOpenChange(false);

      // Reset form fields
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
    } catch (error) {
      console.error('Error submitting employee data:', error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button>Add Employee</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Employee</SheetTitle>
          <SheetDescription>Enter the details of the new employee below.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="username">Email</Label>
            <Input
              id="username"
              name="username"
              type="email"
              value={newEmployee.username}
              onChange={handleInputChange}
              required
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>
          <div className="relative">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="text"
              value={newEmployee.password}
              onChange={handleInputChange}
              required
              className="pr-10"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={newEmployee.firstName}
              onChange={handleInputChange}
              required
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={newEmployee.lastName}
              onChange={handleInputChange}
              required
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
            <Input
              id="phone"
              name="phone"
              value={newEmployee.phone}
              onChange={handleInputChange}
              placeholder={phoneCode}
              className="w-full"
              required
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              value={newEmployee.role.description}
              onValueChange={(value) => setNewEmployee((prev) => ({ ...prev, role: { description: value as 'Admin' | 'Manager' | 'Employee' }}))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Employee">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dateOfEmployment">Date of Employment</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newEmployee.dateOfEmployment ? format(newEmployee.dateOfEmployment, 'PPP') : <span>Pick a date</span>}
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
          <Button type="submit">Add Employee</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
