import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash2, User, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Employee } from './employeeTypes';

interface EmployeeTableProps {
  paginatedEmployees: Employee[];
  selectedEmployees: string[];
  handleSelectEmployee: (id: string) => void;
  handleSelectAll: () => void;
  deleteEmployee: (id: string) => void;
  setEditingEmployee: (employee: Employee) => void;
  setIsEditEmployeeOpen: (open: boolean) => void;
  filteredEmployees: Employee[];
}

export default function EmployeeTable({
  paginatedEmployees,
  selectedEmployees,
  handleSelectEmployee,
  handleSelectAll,
  deleteEmployee,
  setEditingEmployee,
  setIsEditEmployeeOpen,
  filteredEmployees,
}: EmployeeTableProps) {
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedEmployees.length === filteredEmployees.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Password</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date of Employment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedEmployees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>
                <Checkbox
                  checked={selectedEmployees.includes(employee.id)}
                  onCheckedChange={() => handleSelectEmployee(employee.id)}
                />
              </TableCell>
              <TableCell>{employee.firstName} {employee.lastName}</TableCell>
              <TableCell>{employee.username}</TableCell>
              <TableCell className="relative flex items-center">
                {visiblePasswords[employee.id] ? employee.password : '••••••••'}
                <button
                  className=""
                  onClick={() => togglePasswordVisibility(employee.id)}
                >
                  {visiblePasswords[employee.id] ? <Eye className="w-4 h-4 ml-4" /> : <EyeOff className="w-4 h-4 ml-4" />}
                </button>
              </TableCell>
              <TableCell>{employee.phone}</TableCell>
              <TableCell>{employee.role.description}</TableCell>
              <TableCell>{format(employee.dateOfEmployment, 'PP')}</TableCell>
              <TableCell>{employee.status}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => deleteEmployee(employee.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setEditingEmployee(employee);
                      setIsEditEmployeeOpen(true);
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
