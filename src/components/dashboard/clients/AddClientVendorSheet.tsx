import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientVendor } from './CliendVendorTypes';

export default function AddClientVendorSheet({
  isOpen,
  onOpenChange,
  onAddClientVendor,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddClientVendor: (clientVendor: Omit<ClientVendor, 'id'>) => void;
}) {
  const [newClientVendor, setNewClientVendor] = useState<Omit<ClientVendor, 'id'>>({
    name: '',
    phone: '',
    website: '',
    email: '',
    clientVendorType: 'CLIENT',
    address: {
      id: 0,
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
    company: {
      title: '',
      phone: '',
      website: '',
      address: {
        id: 0,
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
      },
    },
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    website: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setNewClientVendor((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else if (name.startsWith('company.')) {
      const companyField = name.split('.')[1];
      setNewClientVendor((prev) => ({
        ...prev,
        company: {
          ...prev.company,
          [companyField]: value,
        },
      }));
    } else if (name.startsWith('company.address.')) {
      const companyAddressField = name.split('.')[2];
      setNewClientVendor((prev) => ({
        ...prev,
        company: {
          ...prev.company,
          address: {
            ...prev.company.address,
            [companyAddressField]: value,
          },
        },
      }));
    } else {
      setNewClientVendor((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    let valid = true;

    if (!newClientVendor.name) {
      newErrors.name = 'Name is required.';
      valid = false;
    }

    if (!newClientVendor.email || !/\S+@\S+\.\S+/.test(newClientVendor.email)) {
      newErrors.email = 'Please enter a valid email.';
      valid = false;
    }

    if (!newClientVendor.phone) {
      newErrors.phone = 'Phone number is required.';
      valid = false;
    }

    if (!newClientVendor.website) {
      newErrors.website = 'Website is required.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onAddClientVendor(newClientVendor);
    onOpenChange(false);

    // Reset the form
    setNewClientVendor({
      name: '',
      phone: '',
      website: '',
      email: '',
      clientVendorType: 'CLIENT',
      address: {
        id: 0,
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
      },
      company: {
        title: '',
        phone: '',
        website: '',
        address: {
          id: 0,
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          country: '',
          zipCode: '',
        },
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button>Add Client/Vendor</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Client/Vendor</SheetTitle>
          <SheetDescription>Enter the details of the new client/vendor below.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={newClientVendor.name}
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
              value={newClientVendor.email}
              onChange={handleInputChange}
              required
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={newClientVendor.phone}
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
              value={newClientVendor.website}
              onChange={handleInputChange}
              required
            />
            {errors.website && <p className="text-red-500 text-sm">{errors.website}</p>}
          </div>
          <div>
            <Label htmlFor="clientVendorType">Type</Label>
            <Select
              value={newClientVendor.clientVendorType}
              onValueChange={(value) =>
                setNewClientVendor((prev) => ({
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
          {/* Company Fields */}
          <div>
            <Label htmlFor="company.title">Company Title</Label>
            <Input
              id="company.title"
              name="company.title"
              value={newClientVendor.company.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="company.phone">Company Phone</Label>
            <Input
              id="company.phone"
              name="company.phone"
              value={newClientVendor.company.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="company.website">Company Website</Label>
            <Input
              id="company.website"
              name="company.website"
              value={newClientVendor.company.website}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit">Add Client/Vendor</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
