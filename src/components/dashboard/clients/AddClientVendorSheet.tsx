import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientVendor } from './CliendVendorTypes';
import axios from 'axios';

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
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setNewClientVendor(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setNewClientVendor(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Client/Vendor Data to Submit:', newClientVendor);

    try {
      // Send the data via POST request using axios
      const response = await axios.post('http://localhost:9090/api/v1/client-vendor/create', newClientVendor, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Log the response for confirmation (optional)
      console.log('Server Response:', response.data);

      // Call the onAddClientVendor callback to update the parent component's state
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
      });
    } catch (error) {
      console.error('Error submitting client/vendor data:', error);
    }
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
          </div>
          <div>
            <Label htmlFor="clientVendorType">Type</Label>
            <Select 
              value={newClientVendor.clientVendorType} 
              onValueChange={(value) => setNewClientVendor(prev => ({ ...prev, clientVendorType: value as 'CLIENT' | 'VENDOR' }))}>
              <SelectTrigger>
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
              value={newClientVendor.address.addressLine1}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="address.addressLine2">Address Line 2</Label>
            <Input
              id="address.addressLine2"
              name="address.addressLine2"
              value={newClientVendor.address.addressLine2}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="address.city">City</Label>
            <Input
              id="address.city"
              name="address.city"
              value={newClientVendor.address.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="address.state">State</Label>
            <Input
              id="address.state"
              name="address.state"
              value={newClientVendor.address.state}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="address.country">Country</Label>
            <Input
              id="address.country"
              name="address.country"
              value={newClientVendor.address.country}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="address.zipCode">Zip Code</Label>
            <Input
              id="address.zipCode"
              name="address.zipCode"
              value={newClientVendor.address.zipCode}
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
