import { useState, useEffect } from 'react';
import { ClientVendor } from './CliendVendorTypes';
import AddClientVendorSheet from './AddClientVendorSheet';
import EditClientVendorSheet from './EditClientVendorSheet';
import ClientVendorTable from './ClientVendorTable';
import Pagination from '../employee/Pagination';
import SearchAndFilter from '../employee/SearchAndFilter';
import testClientVendorListData from './test-clientvendor-list-data'; // Import the local data

export default function ClientVendorList() {
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

  const filterOptions: Array<{ value: keyof ClientVendor; label: string }> = [
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'website', label: 'Website' },
    { value: 'clientVendorType', label: 'Type' },
  ];

  // Load client/vendors from the local data file
  useEffect(() => {
    setClientVendors(testClientVendorListData.data);
  }, []);

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
  const deleteClientVendor = (id: number) => {
    setClientVendors(clientVendors.filter((cv) => cv.id !== id));
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

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Client/Vendor List ({filteredClientVendors.length})</h1>
        <AddClientVendorSheet
          isOpen={isAddClientVendorOpen}
          onOpenChange={setIsAddClientVendorOpen}
          onAddClientVendor={(clientVendor) => {
            setClientVendors([...clientVendors, { ...clientVendor, id: Date.now() }]);
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
          onOpenChange={setIsEditClientVendorOpen}
          clientVendor={editingClientVendor}
          onEditClientVendor={(updatedClientVendor) => {
            setClientVendors(
              clientVendors.map((cv) => (cv.id === updatedClientVendor.id ? updatedClientVendor : cv))
            );
            setIsEditClientVendorOpen(false);
          }}
        />
      )}
    </div>
  );
}
