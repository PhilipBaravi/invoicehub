import { FC } from 'react';
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import testClientVendorListData, { ClientVendor } from '../clients/test-clientvendor-list-data';

interface ClientSelectorProps {
  selectedClient: ClientVendor | null;
  handleClientSelect: (clientName: string) => void;
}

const ClientSelector: FC<ClientSelectorProps> = ({ selectedClient, handleClientSelect }) => {
  return (
    <div>
      <Label htmlFor="client">Billed To</Label>
      <Select onValueChange={(value) => handleClientSelect(value)}>
        <SelectTrigger id="client">
          <SelectValue placeholder="Select a Client" />
        </SelectTrigger>
        <SelectContent>
          {testClientVendorListData.data.map((client) => (
            <SelectItem key={client.id} value={client.name}>
              {client.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedClient && (
        <div className="text-left mt-4">
          <h2 className="text-xl font-bold">{selectedClient.name}</h2>
          <p>{selectedClient.phone}</p>
          <p className="text-blue-700">{selectedClient.website}</p>
          <p className="text-blue-700">{selectedClient.email}</p>
          <p>{selectedClient.address.country}</p>
          <p>{selectedClient.address.city}</p>
          <p>{selectedClient.address.addressLine1}</p>
        </div>
      )}
    </div>
  );
};

export default ClientSelector;
