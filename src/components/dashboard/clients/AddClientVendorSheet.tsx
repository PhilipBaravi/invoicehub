import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientVendor } from './CliendVendorTypes';
import axios from 'axios';
import { useKeycloak } from '@react-keycloak/web';

export default function AddClientVendorSheet({
  isOpen,
  onOpenChange,
  onAddClientVendor,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddClientVendor: (clientVendor: ClientVendor) => void;
}) {
  const { keycloak } = useKeycloak(); // Use keycloak to access token
  const [newClientVendor, setNewClientVendor] = useState<Omit<ClientVendor, 'id'>>({
    name: '',
    phone: '',
    website: '',
    email: '',
    clientVendorType: 'CLIENT',
    address: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    if (keycloak.token) {
      try {
        // Send the data via POST request using axios
        const response = await axios.post(
          'http://localhost:9090/api/v1/clientVendor/create',
          newClientVendor,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${keycloak.token}`,
            },
          }
        );
  
        const createdClientVendor = response.data; // The response should include the ID
        onAddClientVendor(createdClientVendor); // Pass the full ClientVendor object including ID
        onOpenChange(false);
  
        // Reset the form
        setNewClientVendor({
          name: '',
          phone: '',
          website: '',
          email: '',
          clientVendorType: 'CLIENT',
          address: {
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
    } else {
      console.error('User is not authenticated or token is not available');
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
