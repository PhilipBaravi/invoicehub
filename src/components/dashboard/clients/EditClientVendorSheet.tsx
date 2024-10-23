import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientVendor } from './CliendVendorTypes';

export default function EditClientVendorSheet({
  isOpen,
  onOpenChange,
  clientVendor,
  onEditClientVendor,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientVendor: ClientVendor;
  onEditClientVendor: (clientVendor: ClientVendor) => void;
}) {
  const [editedClientVendor, setEditedClientVendor] = useState<ClientVendor>(clientVendor);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
  });

  useEffect(() => {
    if (isOpen) {
      setEditedClientVendor(clientVendor);
    }
  }, [isOpen, clientVendor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setEditedClientVendor((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setEditedClientVendor((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    let valid = true;

    if (!editedClientVendor.name) {
      newErrors.name = 'Name is required.';
      valid = false;
    }

    if (!editedClientVendor.email || !/\S+@\S+\.\S+/.test(editedClientVendor.email)) {
      newErrors.email = 'Please enter a valid email.';
      valid = false;
    }

    if (!editedClientVendor.phone) {
      newErrors.phone = 'Phone number is required.';
      valid = false;
    }

    if (!editedClientVendor.website) {
      newErrors.website = 'Website is required.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Pass the edited client/vendor back to the parent component
    onEditClientVendor(editedClientVendor);
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Client/Vendor</SheetTitle>
          <SheetDescription>Edit the details of the client/vendor below.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Name</Label>
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
            <Label htmlFor="email">Email</Label>
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
            <Label htmlFor="phone">Phone</Label>
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
            <Label htmlFor="website">Website</Label>
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
            <Label htmlFor="clientVendorType">Type</Label>
            <Select
              value={editedClientVendor.clientVendorType}
              onValueChange={(value) =>
                setEditedClientVendor((prev) => ({
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
          <div>
            <Label htmlFor="address.addressLine1">Address Line 1</Label>
            <Input
              id="address.addressLine1"
              name="address.addressLine1"
              value={editedClientVendor.address.addressLine1}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="address.addressLine2">Address Line 2</Label>
            <Input
              id="address.addressLine2"
              name="address.addressLine2"
              value={editedClientVendor.address.addressLine2}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="address.city">City</Label>
            <Input
              id="address.city"
              name="address.city"
              value={editedClientVendor.address.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="address.state">State</Label>
            <Input
              id="address.state"
              name="address.state"
              value={editedClientVendor.address.state}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="address.country">Country</Label>
            <Input
              id="address.country"
              name="address.country"
              value={editedClientVendor.address.country}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="address.zipCode">Zip Code</Label>
            <Input
              id="address.zipCode"
              name="address.zipCode"
              value={editedClientVendor.address.zipCode}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
