import { useState, useEffect } from 'react';
import { Employee } from './employeeTypes';
import AddEmployeeSheet from './AddEmployeeSheet';
import EditEmployeeSheet from './EditEmployeeSheet';
import EmployeeTable from './EmployeeTable';
import Pagination from './Pagination';
import SearchAndFilter from './SearchAndFilter';

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      username: 'john.doe@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1 234 567 8901',
      role: 'Manager',
      dateOfEmployment: new Date('2022-01-15'),
      status: 'Active',
    },
    {
      id: '2',
      username: 'jane.smith@example.com',
      password: 'password456',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1 234 567 8902',
      role: 'Admin',
      dateOfEmployment: new Date('2022-02-20'),
      status: 'Active',
    },
  ]);

  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [filterCategory, setFilterCategory] = useState<keyof Employee>('firstName');

  useEffect(() => {
    const filtered = employees.filter((employee) => {
      const value = employee[filterCategory]?.toString().toLowerCase() ?? '';

      if (filterCategory === 'phone') {
        return employee.phone.replace(/[^0-9]/g, '').includes(searchTerm.replace(/[^0-9]/g, ''));
      }

      if (filterCategory === 'status') {
        return employee.status.toLowerCase().includes(searchTerm.toLowerCase());
      }

      return value.includes(searchTerm.toLowerCase());
    });

    setFilteredEmployees(filtered);
    setCurrentPage(1); // Reset to page 1 after filtering
  }, [searchTerm, employees, filterCategory]);

  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
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
      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
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
        filteredEmployeesLength={filteredEmployees.length}
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
