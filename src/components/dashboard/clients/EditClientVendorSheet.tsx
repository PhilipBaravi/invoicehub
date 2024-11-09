import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiFetch } from '@/utils/api';
import { useKeycloak } from '@react-keycloak/web';
import { useTranslation } from 'react-i18next';

export default function EditClientVendorSheet({
  isOpen,
  onOpenChange,
  clientVendor,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientVendor: any;
}) {
  useKeycloak();

  const { t } = useTranslation('clients');
  const [editedClientVendor, setEditedClientVendor] = useState(clientVendor);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setEditedClientVendor(clientVendor);
    }
  }, [isOpen, clientVendor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setEditedClientVendor((prev: any) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setEditedClientVendor((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let valid = true;

    // Personal Details Validation
    if (!editedClientVendor.name) {
      newErrors.name = t('editValidations.name');
      valid = false;
    }
    if (!editedClientVendor.email || !/\S+@\S+\.\S+/.test(editedClientVendor.email)) {
      newErrors.email = t('editValidations.email');
      valid = false;
    }
    if (!editedClientVendor.phone) {
      newErrors.phone = t('editValidations.phone');
      valid = false;
    }
    if (!editedClientVendor.website) {
      newErrors.website = t('editValidations.website');
      valid = false;
    }

    // Address Validation
    if (!editedClientVendor.address.addressLine1) {
      newErrors.addressLine1 = t('editValidations.addressLine1');
      valid = false;
    }
    if (!editedClientVendor.address.city) {
      newErrors.city = t('editValidations.city');
      valid = false;
    }
    if (!editedClientVendor.address.state) {
      newErrors.state = t('editValidations.state');
      valid = false;
    }
    if (!editedClientVendor.address.country) {
      newErrors.country = t('editValidations.country');
      valid = false;
    }
    if (!editedClientVendor.address.zipCode) {
      newErrors.zipCode = t('editValidations.zipCode');
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await apiFetch(`http://localhost:9090/api/v1/clientVendor/update/${editedClientVendor.id}`, {
        method: 'PUT',
        body: JSON.stringify(editedClientVendor),
      });

      // Close the form
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating client/vendor:', error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t('editClient.editClient')}</SheetTitle>
          <SheetDescription>{t('editClient.editDetails')}</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Personal Details */}
          <div>
            <Label htmlFor="name">{t('editClient.name')}</Label>
            <Input
              id="name"
              name="name"
              value={editedClientVendor.name}
              onChange={handleInputChange}
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="email">{t('editClient.email')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={editedClientVendor.email}
              onChange={handleInputChange}
              required
              readOnly
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="phone">{t('editClient.phone')}</Label>
            <Input
              id="phone"
              name="phone"
              value={editedClientVendor.phone}
              onChange={handleInputChange}
              required
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
          <div>
            <Label htmlFor="website">{t('editClient.website')}</Label>
            <Input
              id="website"
              name="website"
              value={editedClientVendor.website}
              onChange={handleInputChange}
              required
            />
            {errors.website && <p className="text-red-500 text-sm">{errors.website}</p>}
          </div>
          <div>
            <Label htmlFor="clientVendorType">{t('editClient.type')}</Label>
            <Select
              value={editedClientVendor.clientVendorType}
              onValueChange={(value) =>
                setEditedClientVendor((prev: any) => ({
                  ...prev,
                  clientVendorType: value as 'CLIENT' | 'VENDOR',
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
            <Label htmlFor="address.addressLine1">{t('editClient.addressLine1')}</Label>
            <Input
              id="address.addressLine1"
              name="address.addressLine1"
              value={editedClientVendor.address.addressLine1}
              onChange={handleInputChange}
              required
            />
            {errors.addressLine1 && (
              <p className="text-red-500 text-sm">{errors.addressLine1}</p>
            )}
          </div>
          <div>
            <Label htmlFor="address.addressLine2">{t('editClient.addressLine2')}</Label>
            <Input
              id="address.addressLine2"
              name="address.addressLine2"
              value={editedClientVendor.address.addressLine2}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="address.city">{t('editClient.city')}</Label>
            <Input
              id="address.city"
              name="address.city"
              value={editedClientVendor.address.city}
              onChange={handleInputChange}
              required
            />
            {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
          </div>
          <div>
            <Label htmlFor="address.state">{t('editClient.state')}</Label>
            <Input
              id="address.state"
              name="address.state"
              value={editedClientVendor.address.state}
              onChange={handleInputChange}
              required
            />
            {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
          </div>
          <div>
            <Label htmlFor="address.country">{t('editClient.country')}</Label>
            <Input
              id="address.country"
              name="address.country"
              value={editedClientVendor.address.country}
              onChange={handleInputChange}
              required
            />
            {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
          </div>
          <div>
            <Label htmlFor="address.zipCode">{t('editClient.zipCode')}</Label>
            <Input
              id="address.zipCode"
              name="address.zipCode"
              value={editedClientVendor.address.zipCode}
              onChange={handleInputChange}
              required
            />
            {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
          </div>

          <Button type="submit">{t('editClient.save')}</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
