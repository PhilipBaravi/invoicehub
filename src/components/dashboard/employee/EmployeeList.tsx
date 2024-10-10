import { useState, useEffect } from 'react';
import { Employee } from './employeeTypes';
import AddEmployeeSheet from './AddEmployeeSheet';
import EditEmployeeSheet from './EditEmployeeSheet';
import EmployeeTable from './EmployeeTable';
import Pagination from './Pagination';
import SearchAndFilter from './SearchAndFilter';

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [filterCategory, setFilterCategory] = useState<keyof Employee>('firstName');

  const filterOptions: Array<{ value: keyof Employee; label: string }> = [
    { value: 'firstName', label: 'First Name' },
    { value: 'lastName', label: 'Last Name' },
    { value: 'username', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'role', label: 'Role' },
    { value: 'status', label: 'Status' },
  ];

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees.filter((employee) => {
      const value = employee[filterCategory]?.toString().toLowerCase() ?? '';
      return value.includes(searchTerm.toLowerCase());
    });

    setFilteredEmployees(filtered);
    setCurrentPage(1);
  }, [searchTerm, employees, filterCategory]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:9090/api/v1/user/list');
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:9090/api/v1/user/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }
      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleSelectEmployee = (id: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map((emp) => emp.id));
    }
  };

  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employee List ({filteredEmployees.length})</h1>
        <AddEmployeeSheet
          isOpen={isAddEmployeeOpen}
          onOpenChange={setIsAddEmployeeOpen}
          onAddEmployee={(employee) => {
            setEmployees([...employees, { ...employee, id: Date.now().toString() }]);
          }}
        />
      </div>
      <SearchAndFilter<Employee>
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        filterOptions={filterOptions}
      />
      <EmployeeTable
        paginatedEmployees={paginatedEmployees}
        selectedEmployees={selectedEmployees}
        handleSelectEmployee={handleSelectEmployee}
        handleSelectAll={handleSelectAll}
        deleteEmployee={deleteEmployee}
        setEditingEmployee={setEditingEmployee}
        setIsEditEmployeeOpen={setIsEditEmployeeOpen}
        filteredEmployees={filteredEmployees}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        totalItems={filteredEmployees.length}
      />
      {editingEmployee && (
        <EditEmployeeSheet
          isOpen={isEditEmployeeOpen}
          onOpenChange={setIsEditEmployeeOpen}
          employee={editingEmployee}
          onEditEmployee={(updatedEmployee) => {
            setEmployees(
              employees.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
            );
            setIsEditEmployeeOpen(false);
          }}
        />
      )}
    </div>
  );
}