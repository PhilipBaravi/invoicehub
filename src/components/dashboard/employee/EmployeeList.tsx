import { useState, useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { Employee } from "./types";
import AddEmployeeSheet from "./AddEmployeeSheet";
import EditEmployeeSheet from "./EditEmployeeSheet";
import EmployeeTable from "./EmployeeTable";
import Pagination from "./Pagination";
import SearchAndFilter from "./SearchAndFilter";
import { useTranslation } from "react-i18next";
import { useToast } from "@/lib/hooks/use-toast";
import { API_BASE_URL } from "@/lib/utils/constants";

export default function EmployeeList() {
  const { keycloak } = useKeycloak();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [filterCategory, setFilterCategory] =
    useState<keyof Employee>("firstName");
  const { t } = useTranslation("employees");
  const { toast } = useToast();

  const filterOptions: Array<{ value: keyof Employee; label: string }> = [
    { value: "firstName", label: t("filterOptions.firstName") },
    { value: "lastName", label: t("filterOptions.lastName") },
    { value: "username", label: t("filterOptions.username") },
    { value: "phone", label: t("filterOptions.phone") },
    { value: "role", label: t("filterOptions.role") },
    { value: "status", label: t("filterOptions.status") },
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}user/list`, {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch employees");
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
        console.error("Error fetching employees:", error);
      }
    };

    if (keycloak.token) {
      fetchEmployees();
    }
  }, [keycloak.token]);

  useEffect(() => {
    const filtered = employees.filter((employee) => {
      const value = employee[filterCategory]?.toString().toLowerCase() ?? "";
      return value.includes(searchTerm.toLowerCase());
    });

    setFilteredEmployees(filtered);
    setCurrentPage(1);
  }, [searchTerm, employees, filterCategory]);

  const deleteEmployee = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}user/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      if (!response.ok) {
        toast({
          title: t("addEmployee.error"),
          description: t("addEmployee.deleteError"),
          variant: "destructive",
          duration: 3000,
        });
        throw new Error("Failed to delete employee");
      }
      toast({
        title: t("addEmployee.success"),
        description: t("addEmployee.deleteSuccess"),
        variant: "success",
        duration: 3000,
      });
      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
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

  const refreshEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}user/list`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
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
      console.error("Error fetching employees:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-2 md:p-4 lg:p-8 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {t("pageTitle")} ({filteredEmployees.length})
        </h1>
        <AddEmployeeSheet
          isOpen={isAddEmployeeOpen}
          onOpenChange={(open) => {
            setIsAddEmployeeOpen(open);
            if (!open) {
              refreshEmployees();
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
      <div className="overflow-x-auto">
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
      </div>
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
              refreshEmployees();
            }
          }}
          employee={editingEmployee}
        />
      )}
    </div>
  );
}
