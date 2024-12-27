import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, User } from "lucide-react";
import { Employee } from "./types";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("employees");

  return (
    <div className="border rounded-md w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] min-w-[50px]">
              <Checkbox
                checked={selectedEmployees.length === filteredEmployees.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="min-w-[120px]">{t("table.name")}</TableHead>
            <TableHead className="min-w-[180px]">{t("table.email")}</TableHead>
            <TableHead className="min-w-[120px]">{t("table.phone")}</TableHead>
            <TableHead className="min-w-[100px]">{t("table.role")}</TableHead>
            <TableHead className="min-w-[150px]">
              {t("table.dateOfEmployment")}
            </TableHead>
            <TableHead className="min-w-[100px]">{t("table.status")}</TableHead>
            <TableHead className="min-w-[80px]">{t("table.actions")}</TableHead>
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
              <TableCell className="whitespace-nowrap">
                {employee.firstName} {employee.lastName}
              </TableCell>
              <TableCell className="break-all">{employee.username}</TableCell>
              <TableCell className="whitespace-nowrap">
                {employee.phone}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {employee.role.description}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {format(new Date(employee.dateOfEmployment), "PP")}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {employee.status}
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
                    <DropdownMenuItem
                      onClick={() => deleteEmployee(employee.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("table.delete")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingEmployee(employee);
                        setIsEditEmployeeOpen(true);
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      {t("table.edit")}
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
