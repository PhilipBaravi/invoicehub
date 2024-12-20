import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CountryCode,
  getCountryCallingCode,
  isValidPhoneNumber,
} from "libphonenumber-js";
import countryList from "@/components/account-details/profile-form/CountryCodes";
import { Employee } from "./employeeTypes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useKeycloak } from "@react-keycloak/web";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";

type EmployeeErrors = {
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  password?: string;
};

export default function EditEmployeeSheet({
  isOpen,
  onOpenChange,
  employee,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee;
}) {
  const { keycloak } = useKeycloak();
  const [editedEmployee, setEditedEmployee] = useState<Employee>(employee);
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>("US");
  const phoneCode = `+${getCountryCallingCode(phoneCountry)}`;
  const [errors, setErrors] = useState<EmployeeErrors>({});
  const { t } = useTranslation("employees");
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setEditedEmployee(employee);
    }
  }, [isOpen, employee]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: EmployeeErrors = {};
    let valid = true;

    if (!editedEmployee.firstName) {
      newErrors.firstName = t("edit.errirs.firstName");
      valid = false;
    }

    if (!editedEmployee.lastName) {
      newErrors.lastName = t("edit.errors.lastName");
      valid = false;
    }

    const fullPhoneNumber = phoneCode + editedEmployee.phone;
    if (!isValidPhoneNumber(fullPhoneNumber, phoneCountry)) {
      newErrors.phone = t("edit.errors.phone");
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const fullPhoneNumber = phoneCode + editedEmployee.phone;

    const updatedEmployeeData = {
      ...editedEmployee,
      phone: fullPhoneNumber,
      dateOfEmployment: editedEmployee.dateOfEmployment
        ? editedEmployee.dateOfEmployment.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    };

    try {
      const response = await fetch(
        `https://api/invoicehub.space/api/v1/user/update/${employee.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keycloak.token}`,
          },
          body: JSON.stringify(updatedEmployeeData),
        }
      );

      if (!response.ok) {
        toast({
          title: t("error"),
          description: t("edit.errors.updateError"),
          variant: "destructive",
          duration: 3000,
        });
        const errorData = await response.json();
        toast({
          title: t("error"),
          description: t("edit.errors.updateError"),
          variant: "destructive",
          duration: 3000,
        });
        console.error("Error updating employee:", errorData);
        return;
      }

      // Close the sheet after successful update
      toast({
        title: t("success"),
        description: t("edit.errors.updateSuccess"),
        variant: "success",
        duration: 3000,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("edit.title")}</SheetTitle>
          <SheetDescription>{t("edit.titleDescription")}</SheetDescription>
        </SheetHeader>
        <form
          onSubmit={handleSubmit}
          id="editEmployeeForm"
          className="space-y-4 mt-4"
        >
          <div>
            <Label htmlFor="username">{t("edit.email")}</Label>
            <Input
              id="username"
              name="username"
              value={editedEmployee.username}
              onChange={handleInputChange}
              autoComplete="email"
              readOnly
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>
          <div className="relative">
            <Label htmlFor="password">{t("edit.password")}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={editedEmployee.password}
              onChange={handleInputChange}
              autoComplete="new-password"
              required
              className="pr-10"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div>
            <Label htmlFor="firstName">{t("edit.firstName")}</Label>
            <Input
              id="firstName"
              name="firstName"
              value={editedEmployee.firstName}
              onChange={handleInputChange}
              autoComplete="given-name"
              required
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName}</p>
            )}
          </div>
          <div>
            <Label htmlFor="lastName">{t("edit.lastName")}</Label>
            <Input
              id="lastName"
              name="lastName"
              value={editedEmployee.lastName}
              onChange={handleInputChange}
              autoComplete="family-name"
              required
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName}</p>
            )}
          </div>
          <div className="flex space-x-2">
            <Select
              onValueChange={(value) => setPhoneCountry(value as CountryCode)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue
                  placeholder={
                    countryList.find((c) => c.code === phoneCountry)?.name ||
                    t("edit.selectCountry")
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
            <div className="flex flex-col">
              <Input
                id="phone"
                name="phone"
                value={editedEmployee.phone}
                onChange={handleInputChange}
                placeholder={phoneCode}
                autoComplete="tel"
                required
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="role">{t("edit.role")}</Label>
            <Select
              value={editedEmployee.role.description}
              onValueChange={(value) =>
                setEditedEmployee((prev) => ({
                  ...prev,
                  role: {
                    description: value as "Admin" | "Manager" | "Employee",
                  },
                }))
              }
            >
              <SelectTrigger id="role">
                <SelectValue placeholder={t("edit.selectRole")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Employee">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dateOfEmployment">
              {t("edit.dateOfEmployment")}
            </Label>
            <Popover>
              <PopoverTrigger asChild id="dateOfEmployment">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editedEmployee.dateOfEmployment
                    ? format(editedEmployee.dateOfEmployment, "PPP")
                    : t("edit.pickDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={editedEmployee.dateOfEmployment}
                  onSelect={(date) =>
                    setEditedEmployee((prev) => ({
                      ...prev,
                      dateOfEmployment: date || new Date(),
                    }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button type="submit">{t("edit.save")}</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
