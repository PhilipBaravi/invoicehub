import { useState, useEffect } from 'react'
import { Employee } from './employeeTypes'
import AddEmployeeSheet from './AddEmployeeSheet'
import EditEmployeeSheet from './EditEmployeeSheet'
import EmployeeTable from './EmployeeTable'
import Pagination from './Pagination'
import SearchAndFilter from './SearchAndFilter'

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 234 567 8901',
      role: 'Manager',
      department: 'Sales',
      employeeId: 'EMP001',
      dateOfEmployment: new Date('2022-01-15'),
      accessPermissions: 'Admin',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 234 567 8902',
      role: 'Engineer',
      department: 'Development',
      employeeId: 'EMP002',
      dateOfEmployment: new Date('2022-02-20'),
      accessPermissions: 'User',
      status: 'Active',
    },
    {
      id: '3',
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      phone: '+1 234 567 8903',
      role: 'Designer',
      department: 'Marketing',
      employeeId: 'EMP003',
      dateOfEmployment: new Date('2022-03-10'),
      accessPermissions: 'User',
      status: 'Inactive',
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone: '+1 234 567 8904',
      role: 'HR Manager',
      department: 'Human Resources',
      employeeId: 'EMP004',
      dateOfEmployment: new Date('2021-12-01'),
      accessPermissions: 'Admin',
      status: 'Active',
    },
    {
      id: '5',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '+1 234 567 8905',
      role: 'Product Manager',
      department: 'Product',
      employeeId: 'EMP005',
      dateOfEmployment: new Date('2022-04-05'),
      accessPermissions: 'Admin',
      status: 'Active',
    },
    {
      id: '6',
      name: 'Olivia Wilson',
      email: 'olivia.wilson@example.com',
      phone: '+1 234 567 8906',
      role: 'Finance Analyst',
      department: 'Finance',
      employeeId: 'EMP006',
      dateOfEmployment: new Date('2021-09-22'),
      accessPermissions: 'User',
      status: 'Active',
    },
    {
      id: '7',
      name: 'William Martinez',
      email: 'william.martinez@example.com',
      phone: '+1 234 567 8907',
      role: 'Support Specialist',
      department: 'Support',
      employeeId: 'EMP007',
      dateOfEmployment: new Date('2021-11-15'),
      accessPermissions: 'User',
      status: 'Inactive',
    },
    {
      id: '8',
      name: 'Sophia Anderson',
      email: 'sophia.anderson@example.com',
      phone: '+1 234 567 8908',
      role: 'Data Scientist',
      department: 'Data',
      employeeId: 'EMP008',
      dateOfEmployment: new Date('2022-01-30'),
      accessPermissions: 'Admin',
      status: 'Active',
    },
    {
      id: '9',
      name: 'James Thomas',
      email: 'james.thomas@example.com',
      phone: '+1 234 567 8909',
      role: 'QA Tester',
      department: 'Quality Assurance',
      employeeId: 'EMP009',
      dateOfEmployment: new Date('2022-06-12'),
      accessPermissions: 'User',
      status: 'Active',
    },
    {
      id: '10',
      name: 'Isabella Garcia',
      email: 'isabella.garcia@example.com',
      phone: '+1 234 567 8910',
      role: 'UX Designer',
      department: 'Design',
      employeeId: 'EMP010',
      dateOfEmployment: new Date('2022-07-15'),
      accessPermissions: 'User',
      status: 'Active',
    },
    {
      id: '11',
      name: 'Liam Clark',
      email: 'liam.clark@example.com',
      phone: '+1 234 567 8911',
      role: 'DevOps Engineer',
      department: 'Development',
      employeeId: 'EMP011',
      dateOfEmployment: new Date('2021-08-19'),
      accessPermissions: 'Admin',
      status: 'Inactive',
    },
    {
      id: '12',
      name: 'Ava Hernandez',
      email: 'ava.hernandez@example.com',
      phone: '+1 234 567 8912',
      role: 'Content Creator',
      department: 'Marketing',
      employeeId: 'EMP012',
      dateOfEmployment: new Date('2022-03-22'),
      accessPermissions: 'User',
      status: 'Active',
    },
    {
      id: '13',
      name: 'Benjamin Lee',
      email: 'benjamin.lee@example.com',
      phone: '+1 234 567 8913',
      role: 'Network Engineer',
      department: 'IT',
      employeeId: 'EMP013',
      dateOfEmployment: new Date('2021-07-30'),
      accessPermissions: 'Admin',
      status: 'Active',
    },
    {
      id: '14',
      name: 'Mia Gonzalez',
      email: 'mia.gonzalez@example.com',
      phone: '+1 234 567 8914',
      role: 'Legal Advisor',
      department: 'Legal',
      employeeId: 'EMP014',
      dateOfEmployment: new Date('2021-09-10'),
      accessPermissions: 'User',
      status: 'Inactive',
    },
    {
      id: '15',
      name: 'Lucas Scott',
      email: 'lucas.scott@example.com',
      phone: '+1 234 567 8915',
      role: 'Sales Executive',
      department: 'Sales',
      employeeId: 'EMP015',
      dateOfEmployment: new Date('2021-06-25'),
      accessPermissions: 'User',
      status: 'Active',
    },
    {
      id: '16',
      name: 'Charlotte Harris',
      email: 'charlotte.harris@example.com',
      phone: '+1 234 567 8916',
      role: 'Project Manager',
      department: 'Product',
      employeeId: 'EMP016',
      dateOfEmployment: new Date('2022-04-14'),
      accessPermissions: 'Admin',
      status: 'Active',
    },
  ])
  

  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [filterCategory, setFilterCategory] = useState<keyof Employee>('name')

  useEffect(() => {
    const filtered = employees.filter((employee) => {
      const value = employee[filterCategory]?.toString().toLowerCase() ?? ''
  
      if (filterCategory === 'phone') {
        return employee.phone.replace(/[^0-9]/g, '').includes(searchTerm.replace(/[^0-9]/g, ''))
      }
  
      if (filterCategory === 'status') {
        return employee.status.toLowerCase().includes(searchTerm.toLowerCase())
      }
  
      return value.includes(searchTerm.toLowerCase())
    })
  
    setFilteredEmployees(filtered)
    setCurrentPage(1)
  }, [searchTerm, employees, filterCategory])
  

  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id))
  }

  const handleSelectEmployee = (id: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([])
    } else {
      setSelectedEmployees(filteredEmployees.map((emp) => emp.id))
    }
  }

  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage)
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employee List ({filteredEmployees.length})</h1>
        <AddEmployeeSheet
          isOpen={isAddEmployeeOpen}
          onOpenChange={setIsAddEmployeeOpen}
          onAddEmployee={(employee) => {
            setEmployees([...employees, { ...employee, id: Date.now().toString() }])
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
            setEmployees(employees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp))
            setIsEditEmployeeOpen(false)
          }}
        />
      )}
    </div>
  )
}
