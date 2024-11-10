import { FC } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClientVendor } from './invoice-types';
import { useTranslation } from 'react-i18next';

interface ClientSelectorProps {
  selectedClient: ClientVendor | null;
  handleClientSelect: (clientName: string) => void;
  clients: ClientVendor[];
}

const ClientSelector: FC<ClientSelectorProps> = ({ selectedClient, handleClientSelect, clients }) => {
  const { t } = useTranslation('invoices')
  return (
    <div>
      <Label htmlFor="client">{t('invoice.clientSelector.billed')}</Label>
      <Select onValueChange={(value) => handleClientSelect(value)}>
        <SelectTrigger id="client">
          <SelectValue placeholder={t('invoice.clientSelector.select')} />
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
          <h2 className="text-xl font-bold">{t('invoice.clientSelector.name')} {selectedClient.name}</h2>
          <p className='font-[600]'>Phone: {selectedClient.phone}</p>
          <p>
            <span className='text-stone-950 dark:text-stone-50 font-[600]'>{t('invoice.clientSelector.website')}</span> 
            <span className='font-[600] text-blue-700'>{selectedClient.website}</span>
          </p>
          <p>
            <span className='text-stone-950 dark:text-stone-50 font-[600]'>{t('invoice.clientSelector.email')}</span> 
            <span className='font-[600] text-blue-700'>{selectedClient.email}</span>
          </p>
          <p>
            <span className='font-[600]'>{t('invoice.clientSelector.country')}</span> 
            <span className='text-stone-950 dark:text-stone-50 font-[600]'>{selectedClient.address.country}</span>
          </p>
          <p>
            <span className='font-[600]'>{t('invoice.clientSelector.city')}</span> 
            <span className='text-stone-950 dark:text-stone-50 font-[600]'>{selectedClient.address.city}</span>
          </p>
          <p>
            <span className='font-[600]'>{t('invoice.clientSelector.address')}</span> 
            <span className='text-stone-950 dark:text-stone-50 font-[600]'>{selectedClient.address.addressLine1}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientSelector;
