import { FC } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClientVendor } from './invoice-types';

interface ClientSelectorProps {
  selectedClient: ClientVendor | null;
  handleClientSelect: (clientName: string) => void;
  clients: ClientVendor[];
}

const ClientSelector: FC<ClientSelectorProps> = ({ selectedClient, handleClientSelect, clients }) => {
  return (
    <div>
      <Label htmlFor="client">Billed To</Label>
      <Select onValueChange={(value) => handleClientSelect(value)}>
        <SelectTrigger id="client">
          <SelectValue placeholder="Select a Client" />
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.name}>
              {client.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedClient && (
        <div className="text-left mt-4">
          <h2 className="text-xl font-bold">Company Name: {selectedClient.name}</h2>
          <p className='font-[600]'>Phone: {selectedClient.phone}</p>
          <p>
            <span className='text-stone-950 dark:text-stone-50 font-[600]'>Website:</span> 
            <span className='font-[600] text-blue-700'>{selectedClient.website}</span>
          </p>
          <p>
            <span className='text-stone-950 dark:text-stone-50 font-[600]'>Email:</span> 
            <span className='font-[600] text-blue-700'>{selectedClient.email}</span>
          </p>
          <p>
            <span className='font-[600]'>Country:</span> 
            <span className='text-stone-950 dark:text-stone-50 font-[600]'>{selectedClient.address.country}</span>
          </p>
          <p>
            <span className='font-[600]'>City:</span> 
            <span className='text-stone-950 dark:text-stone-50 font-[600]'>{selectedClient.address.city}</span>
          </p>
          <p>
            <span className='font-[600]'>Address:</span> 
            <span className='text-stone-950 dark:text-stone-50 font-[600]'>{selectedClient.address.addressLine1}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientSelector;
