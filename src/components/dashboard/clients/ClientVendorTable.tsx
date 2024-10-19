import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash2, User } from 'lucide-react';
import { ClientVendor } from './CliendVendorTypes';

interface ClientVendorTableProps {
  paginatedClientVendors: ClientVendor[];
  selectedClientVendors: string[];
  handleSelectClientVendor: (id: string) => void;
  handleSelectAll: () => void;
  deleteClientVendor: (id: number) => void;
  setEditingClientVendor: (clientVendor: ClientVendor) => void;
  setIsEditClientVendorOpen: (open: boolean) => void;
  filteredClientVendors: ClientVendor[];
}

export default function ClientVendorTable({
  paginatedClientVendors,
  selectedClientVendors,
  handleSelectClientVendor,
  handleSelectAll,
  deleteClientVendor,
  setEditingClientVendor,
  setIsEditClientVendorOpen,
  filteredClientVendors,
}: ClientVendorTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedClientVendors.length === filteredClientVendors.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedClientVendors.map((clientVendor) => (
            <TableRow key={clientVendor.id}>
              <TableCell>
                <Checkbox
                  checked={selectedClientVendors.includes(clientVendor.id.toString())}
                  onCheckedChange={() => handleSelectClientVendor(clientVendor.id.toString())}
                />
              </TableCell>
              <TableCell>{clientVendor.name}</TableCell>
              <TableCell>{clientVendor.email}</TableCell>
              <TableCell>{clientVendor.phone}</TableCell>
              <TableCell>{clientVendor.website}</TableCell>
              <TableCell>{clientVendor.clientVendorType}</TableCell>
              <TableCell>
                {clientVendor.address.addressLine1}, {clientVendor.address.city}, {clientVendor.address.state}, {clientVendor.address.country}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => deleteClientVendor(clientVendor.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setEditingClientVendor(clientVendor);
                      setIsEditClientVendorOpen(true);
                    }}>
                      <User className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
