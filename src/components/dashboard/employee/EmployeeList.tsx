import { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Employee } from './employeeTypes';
import AddEmployeeSheet from './AddEmployeeSheet';
import EditEmployeeSheet from './EditEmployeeSheet';
import EmployeeTable from './EmployeeTable';
import Pagination from './Pagination';
import SearchAndFilter from './SearchAndFilter';

export default function EmployeeList() {
  const { keycloak } = useKeycloak();
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

  // Fetch employee data from API with bearer token
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:9090/api/v1/user/list', {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        const data = await response.json();
        const users = data.data.map((user: any) => ({
          ...user,
          id: user.id.toString(),
          dateOfEmployment: new Date(user.dateOfEmployment),
          status: user.userStatus, // Map userStatus from API to status in Employee object
        }));
        setEmployees(users);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    if (keycloak.token) {
      fetchEmployees();
    }
  }, [keycloak.token]);

  // Re-filter employees when search term, employee list, or filter category changes
  useEffect(() => {
    const filtered = employees.filter((employee) => {
      const value = employee[filterCategory]?.toString().toLowerCase() ?? '';
      return value.includes(searchTerm.toLowerCase());
    });

    setFilteredEmployees(filtered);
    setCurrentPage(1);
  }, [searchTerm, employees, filterCategory]);

  // Delete employee by ID
  const deleteEmployee = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:9090/api/v1/user/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }

      // If the deletion is successful, remove the employee from the local state
      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  // Handle selecting an individual employee
  const handleSelectEmployee = (id: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };

  // Handle selecting all employees
  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map((emp) => emp.id));
    }
  };

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);

  // Slice the employees array for pagination
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Refresh employees after adding or editing
  const refreshEmployees = async () => {
    try {
      const response = await fetch('http://localhost:9090/api/v1/user/list', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      const users = data.data.map((user: any) => ({
        ...user,
        id: user.id.toString(),
        dateOfEmployment: new Date(user.dateOfEmployment),
        status: user.userStatus,
      }));
      setEmployees(users);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 w-full px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employee List ({filteredEmployees.length})</h1>
        <AddEmployeeSheet
          isOpen={isAddEmployeeOpen}
          onOpenChange={(open) => {
            setIsAddEmployeeOpen(open);
            if (!open) {
              refreshEmployees(); // Refresh the employee list after adding
            }
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
          onOpenChange={(open) => {
            setIsEditEmployeeOpen(open);
            if (!open) {
              refreshEmployees(); // Refresh the employee list after editing
            }
          }}
          employee={editingEmployee}
        />
      )}
    </div>
  );
}
