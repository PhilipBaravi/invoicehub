import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientVendor } from './CliendVendorTypes';
import axios from 'axios';
import { useKeycloak } from '@react-keycloak/web';

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
  const { keycloak } = useKeycloak(); // Use keycloak to access the token
  const [editedClientVendor, setEditedClientVendor] = useState<ClientVendor>(clientVendor);

  useEffect(() => {
    if (isOpen) {
      setEditedClientVendor(clientVendor);
    }
  }, [isOpen, clientVendor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setEditedClientVendor(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setEditedClientVendor(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Edited Client/Vendor data submitted:', editedClientVendor);

    if (keycloak.authenticated && keycloak.token) {
      try {
        // Send the data via PUT request using axios
        const response = await axios.put(
          `http://localhost:9090/api/v1/client-vendor/update/${editedClientVendor.id}`,
          editedClientVendor,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${keycloak.token}`, // Add the bearer token in the Authorization header
            },
          }
        );

        console.log('Server Response:', response.data);

        // Update the parent component with the edited client/vendor data
        onEditClientVendor(editedClientVendor);
        onOpenChange(false);
      } catch (error) {
        console.error('Error updating client/vendor data:', error);
      }
    } else {
      console.error('User is not authenticated or token is not available');
    }
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
            />
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
          </div>
          <div>
            <Label htmlFor="clientVendorType">Type</Label>
            <Select 
              value={editedClientVendor.clientVendorType} 
              onValueChange={(value) => setEditedClientVendor(prev => ({ ...prev, clientVendorType: value as 'CLIENT' | 'VENDOR' }))}>
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
