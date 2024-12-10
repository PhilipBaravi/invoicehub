import { useState, useEffect } from 'react';
import { ClientVendor } from './CliendVendorTypes';
import AddClientVendorSheet from './AddClientVendorSheet';
import EditClientVendorSheet from './EditClientVendorSheet';
import ClientVendorTable from './ClientVendorTable';
import Pagination from '../employee/Pagination';
import SearchAndFilter from '../employee/SearchAndFilter';
import { useKeycloak } from '@react-keycloak/web';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

export default function ClientVendorList() {
  const { keycloak } = useKeycloak();
  const { t } = useTranslation('clients');
  const [clientVendors, setClientVendors] = useState<ClientVendor[]>([]);
  const [filteredClientVendors, setFilteredClientVendors] = useState<ClientVendor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientVendors, setSelectedClientVendors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isAddClientVendorOpen, setIsAddClientVendorOpen] = useState(false);
  const [isEditClientVendorOpen, setIsEditClientVendorOpen] = useState(false);
  const [editingClientVendor, setEditingClientVendor] = useState<ClientVendor | null>(null);
  const [filterCategory, setFilterCategory] = useState<keyof ClientVendor>('name');
  const { toast } = useToast()

  const filterOptions: Array<{ value: keyof ClientVendor; label: string }> = [
    { value: 'name', label: t('clientFilter.name') },
    { value: 'email', label: t('clientFilter.email') },
    { value: 'phone', label: t('clientFilter.phone') },
    { value: 'website', label: t('clientFilter.website') },
    { value: 'clientVendorType', label: t('clientFilter.type') },
  ];

  useEffect(() => {
    const fetchClientVendors = async () => {
      try {
        const response = await fetch('https://api.invoicehub.space/clientVendor/list', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keycloak.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setClientVendors(data.data);
        } else {
          console.error('Failed to fetch client/vendors');
        }
      } catch (error) {
        console.error('Error fetching client/vendors:', error);
      }
    };

    if (keycloak && keycloak.token) {
      fetchClientVendors();
    }
  }, [keycloak]);

  // Re-filter client/vendors when search term, client vendor list, or filter category changes
  useEffect(() => {
    const filtered = clientVendors.filter((clientVendor) => {
      const value = clientVendor[filterCategory]?.toString().toLowerCase() ?? '';
      return value.includes(searchTerm.toLowerCase());
    });

    setFilteredClientVendors(filtered);
    setCurrentPage(1);
  }, [searchTerm, clientVendors, filterCategory]);

  // Delete client/vendor by ID
  const deleteClientVendor = async (id: number) => {
    try {
      const response = await fetch(`https://api.invoicehub.space/clientVendor/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });
  
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 409 && data.message === "Client has invoice(s) and cannot be deleted.") {
          toast({
            title: t("addClient.error"),
            description: t("addClient.deleteError"),
            variant: "destructive",
            duration: 3000,
          });
        } else {
          console.error("Failed to delete client/vendor:", data.message);
        }
        return;
      }
      toast({
        title: t('addClient.success'),
        description: t('addClient.deleteSuccess'),
        variant: 'success',
        duration: 3000
      })
      setClientVendors((prevClientVendors) =>
        prevClientVendors.filter((cv) => cv.id !== id)
      );
    } catch (error) {
      console.error("Error deleting client/vendor:", error);
    }
  };

  // Handle selecting an individual client/vendor
  const handleSelectClientVendor = (id: string) => {
    setSelectedClientVendors((prev) =>
      prev.includes(id) ? prev.filter((cvId) => cvId !== id) : [...prev, id]
    );
  };

  // Handle selecting all client/vendors
  const handleSelectAll = () => {
    if (selectedClientVendors.length === filteredClientVendors.length) {
      setSelectedClientVendors([]);
    } else {
      setSelectedClientVendors(filteredClientVendors.map((cv) => cv.id.toString()));
    }
  };

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredClientVendors.length / rowsPerPage);

  // Slice the clientVendors array for pagination
  const paginatedClientVendors = filteredClientVendors.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Refresh the client/vendors list
  const refreshClientVendors = async () => {
    try {
      const response = await fetch('https://api.invoicehub.space/clientVendor/list', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClientVendors(data.data);
      } else {
        console.error('Failed to fetch client/vendors');
      }
    } catch (error) {
      console.error('Error fetching client/vendors:', error);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-2 md:p-4 lg:p-8 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {t('pageTitle')} ({filteredClientVendors.length})
        </h1>
        <AddClientVendorSheet
          isOpen={isAddClientVendorOpen}
          onOpenChange={(open) => {
            setIsAddClientVendorOpen(open);
            if (!open) {
              refreshClientVendors();
            }
          }}
        />
      </div>
      <SearchAndFilter<ClientVendor>
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        filterOptions={filterOptions}
      />
      <ClientVendorTable
        paginatedClientVendors={paginatedClientVendors}
        selectedClientVendors={selectedClientVendors}
        handleSelectClientVendor={handleSelectClientVendor}
        handleSelectAll={handleSelectAll}
        deleteClientVendor={deleteClientVendor}
        setEditingClientVendor={setEditingClientVendor}
        setIsEditClientVendorOpen={setIsEditClientVendorOpen}
        filteredClientVendors={filteredClientVendors}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        totalItems={filteredClientVendors.length}
      />
      {editingClientVendor && (
        <EditClientVendorSheet
          isOpen={isEditClientVendorOpen}
          onOpenChange={(open) => {
            setIsEditClientVendorOpen(open);
            if (!open) {
              refreshClientVendors();
            }
          }}
          clientVendor={editingClientVendor}
        />
      )}
    </div>
  );
}
