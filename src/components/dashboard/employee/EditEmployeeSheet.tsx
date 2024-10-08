import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from 'lucide-react'
import { Calendar } from "@/components/ui/calendar"
import { format } from 'date-fns'
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Employee } from './employeeTypes'

export default function EditEmployeeSheet({
  isOpen,
  onOpenChange,
  employee,
  onEditEmployee,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  employee: Employee
  onEditEmployee: (employee: Employee) => void
}) {
  const [editedEmployee, setEditedEmployee] = useState<Employee>(employee)

  // Ensuring that the employee data is refreshed whenever the component is opened
  useEffect(() => {
    if (isOpen) {
      setEditedEmployee(employee)  // Reset the edited employee data when the modal opens
    }
  }, [isOpen, employee])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedEmployee(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onEditEmployee(editedEmployee)
    onOpenChange(false) // Close the sheet after saving
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Employee</SheetTitle>
          <SheetDescription>Edit the details of the employee below.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={editedEmployee.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={editedEmployee.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={editedEmployee.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              name="role"
              value={editedEmployee.role}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              name="department"
              value={editedEmployee.department}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              name="employeeId"
              value={editedEmployee.employeeId}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="dateOfEmployment">Date of Employment</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !editedEmployee.dateOfEmployment && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editedEmployee.dateOfEmployment
                    ? format(editedEmployee.dateOfEmployment, "PPP")
                    : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={editedEmployee.dateOfEmployment}
                  onSelect={(date) => setEditedEmployee(prev => ({ ...prev, dateOfEmployment: date || new Date() }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="accessPermissions">Access Permissions</Label>
            <Input
              id="accessPermissions"
              name="accessPermissions"
              value={editedEmployee.accessPermissions}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              name="status"
              value={editedEmployee.status}
              onValueChange={(value) =>
                setEditedEmployee((prev) => ({
                  ...prev,
                  status: value as 'Active' | 'Inactive',
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
