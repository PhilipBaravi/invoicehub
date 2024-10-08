import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, UserPlus } from 'lucide-react'
import { Calendar } from "@/components/ui/calendar"
import { format } from 'date-fns'
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Employee } from './employeeTypes'

export default function AddEmployeeSheet({ isOpen, onOpenChange, onAddEmployee }: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void
}) {
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id'>>({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    employeeId: '',
    dateOfEmployment: new Date(),
    accessPermissions: '',
    status: 'Active',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewEmployee(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Employee data submitted:', newEmployee)
    onAddEmployee(newEmployee)
    onOpenChange(false)
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      employeeId: '',
      dateOfEmployment: new Date(),
      accessPermissions: '',
      status: 'Active',
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Employee</SheetTitle>
          <SheetDescription>
            Enter the details of the new employee below.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={newEmployee.name} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={newEmployee.email} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" value={newEmployee.phone} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" value={newEmployee.role} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input id="department" name="department" value={newEmployee.department} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input id="employeeId" name="employeeId" value={newEmployee.employeeId} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="dateOfEmployment">Date of Employment</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !newEmployee.dateOfEmployment && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newEmployee.dateOfEmployment ? format(newEmployee.dateOfEmployment, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={newEmployee.dateOfEmployment}
                  onSelect={(date) => setNewEmployee(prev => ({ ...prev, dateOfEmployment: date || new Date() }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="accessPermissions">Access Permissions</Label>
            <Input id="accessPermissions" name="accessPermissions" value={newEmployee.accessPermissions} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select name="status" value={newEmployee.status} onValueChange={(value) => setNewEmployee(prev => ({ ...prev, status: value as 'Active' | 'Inactive' }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Add Employee</Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
