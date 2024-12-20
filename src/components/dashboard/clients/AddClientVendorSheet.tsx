import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiFetch } from "@/utils/api";
import { useKeycloak } from "@react-keycloak/web";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";

export default function AddClientVendorSheet({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  useKeycloak();

  const initialClientVendorState = {
    name: "",
    phone: "",
    website: "",
    email: "",
    clientVendorType: "CLIENT",
    address: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
  };

  const { t } = useTranslation("clients");
  const [newClientVendor, setNewClientVendor] = useState(
    initialClientVendorState
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setNewClientVendor((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setNewClientVendor((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let valid = true;

    // Personal Details Validation
    if (!newClientVendor.name) {
      newErrors.name = t("validations.name");
      valid = false;
    }
    if (!newClientVendor.email || !/\S+@\S+\.\S+/.test(newClientVendor.email)) {
      newErrors.email = t("validations.email");
      valid = false;
    }
    if (!newClientVendor.phone) {
      newErrors.phone = t("validations.phone");
      valid = false;
    }
    if (!newClientVendor.website) {
      newErrors.website = t("validations.website");
      valid = false;
    }

    // Address Validation
    if (!newClientVendor.address.addressLine1) {
      newErrors.addressLine1 = t("validations.addressLine1");
      valid = false;
    }
    if (!newClientVendor.address.city) {
      newErrors.city = t("validations.city");
      valid = false;
    }
    if (!newClientVendor.address.state) {
      newErrors.state = t("validations.state");
      valid = false;
    }
    if (!newClientVendor.address.country) {
      newErrors.country = t("validations.country");
      valid = false;
    }
    if (!newClientVendor.address.zipCode) {
      newErrors.zipCode = t("validations.zipCode");
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await apiFetch(
        "https://api/invoicehub.space/api/v1/clientVendor/create",
        {
          method: "POST",
          body: JSON.stringify(newClientVendor),
        }
      );
      toast({
        title: t("addClient.success"),
        description: t("addClient.addSuccess"),
        variant: "success",
        duration: 3000,
      });
      // Close the form
      onOpenChange(false);
      // Reset the form
      setNewClientVendor(initialClientVendorState);
      setErrors({});
    } catch (error) {
      toast({
        title: t("addClient.error"),
        description: t("addClient.addError"),
        variant: "destructive",
        duration: 3000,
      });
      console.error("Error adding client/vendor:", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button>{t("addClient.addClient")}</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("addClient.addNewClient")}</SheetTitle>
          <SheetDescription>{t("addClient.details")}</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Personal Details */}
          <div>
            <Label htmlFor="name">{t("addClient.name")}</Label>
            <Input
              id="name"
              name="name"
              value={newClientVendor.name}
              onChange={handleInputChange}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">{t("addClient.email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={newClientVendor.email}
              onChange={handleInputChange}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone">{t("addClient.phone")}</Label>
            <Input
              id="phone"
              name="phone"
              value={newClientVendor.phone}
              onChange={handleInputChange}
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>
          <div>
            <Label htmlFor="website">{t("addClient.website")}</Label>
            <Input
              id="website"
              name="website"
              value={newClientVendor.website}
              onChange={handleInputChange}
              required
            />
            {errors.website && (
              <p className="text-red-500 text-sm">{errors.website}</p>
            )}
          </div>
          <div>
            <Label htmlFor="clientVendorType">{t("addClient.type")}</Label>
            <Select
              value={newClientVendor.clientVendorType}
              onValueChange={(value) =>
                setNewClientVendor((prev) => ({
                  ...prev,
                  clientVendorType: value as "CLIENT" | "VENDOR",
                }))
              }
            >
              <SelectTrigger id="clientVendorType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CLIENT">Client</SelectItem>
                <SelectItem value="VENDOR">Vendor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Address Details */}
          <div>
            <Label htmlFor="address.addressLine1">
              {t("addClient.addressLine1")}
            </Label>
            <Input
              id="address.addressLine1"
              name="address.addressLine1"
              value={newClientVendor.address.addressLine1}
              onChange={handleInputChange}
              required
            />
            {errors.addressLine1 && (
              <p className="text-red-500 text-sm">{errors.addressLine1}</p>
            )}
          </div>
          <div>
            <Label htmlFor="address.addressLine2">
              {t("addClient.addressLine2")}
            </Label>
            <Input
              id="address.addressLine2"
              name="address.addressLine2"
              value={newClientVendor.address.addressLine2}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="address.city">{t("addClient.city")}</Label>
            <Input
              id="address.city"
              name="address.city"
              value={newClientVendor.address.city}
              onChange={handleInputChange}
              required
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city}</p>
            )}
          </div>
          <div>
            <Label htmlFor="address.state">{t("addClient.state")}</Label>
            <Input
              id="address.state"
              name="address.state"
              value={newClientVendor.address.state}
              onChange={handleInputChange}
              required
            />
            {errors.state && (
              <p className="text-red-500 text-sm">{errors.state}</p>
            )}
          </div>
          <div>
            <Label htmlFor="address.country">{t("addClient.country")}</Label>
            <Input
              id="address.country"
              name="address.country"
              value={newClientVendor.address.country}
              onChange={handleInputChange}
              required
            />
            {errors.country && (
              <p className="text-red-500 text-sm">{errors.country}</p>
            )}
          </div>
          <div>
            <Label htmlFor="address.zipCode">{t("addClient.zipCode")}</Label>
            <Input
              id="address.zipCode"
              name="address.zipCode"
              value={newClientVendor.address.zipCode}
              onChange={handleInputChange}
              required
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm">{errors.zipCode}</p>
            )}
          </div>

          <Button type="submit">{t("addClient.addClient")}</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
