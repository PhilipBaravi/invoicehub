import { FC, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CreditCard, Trash2, Edit2, Eye, EyeOff, CheckCircle2 } from "lucide-react"

type PaymentMethod = {
  id: string;
  type: "credit" | "bank";
  last4: string;
  expiry?: string;
  name: string;
  isDefault: boolean;
}

const ManagePaymentMethods : FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "1", type: "credit", last4: "4242", expiry: "12/24", name: "John Doe", isDefault: true },
    { id: "2", type: "bank", last4: "1234", name: "Jane Doe", isDefault: false },
  ])
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)
  const [showFullDetails, setShowFullDetails] = useState<Record<string, boolean>>({})
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const [newMethod, setNewMethod] = useState({
    type: "credit" as "credit" | "bank",
    name: "",
    number: "",
    expiry: "",
    cvv: "",
    accountNumber: "",
    routingNumber: "",
    bankName: "",
    accountType: "checking" as "checking" | "savings",
  })

  const handleAddNewMethod = (e: React.FormEvent) => {
    e.preventDefault()
    const newPaymentMethod: PaymentMethod = {
      id: `new-${Date.now()}`,
      type: newMethod.type,
      last4: newMethod.type === "credit" ? newMethod.number.slice(-4) : newMethod.accountNumber.slice(-4),
      expiry: newMethod.type === "credit" ? newMethod.expiry : undefined,
      name: newMethod.name,
      isDefault: paymentMethods.length === 0,
    }
    setPaymentMethods([...paymentMethods, newPaymentMethod])
    setNewMethod({
      type: "credit",
      name: "",
      number: "",
      expiry: "",
      cvv: "",
      accountNumber: "",
      routingNumber: "",
      bankName: "",
      accountType: "checking",
    })
    setAlert({ type: 'success', message: 'Payment method added successfully!' })
  }

  const handleDeleteMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id))
    setAlert({ type: 'success', message: 'Payment method deleted successfully!' })
  }

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })))
    setAlert({ type: 'success', message: 'Default payment method updated!' })
  }

  const handleToggleDetails = (id: string) => {
    setShowFullDetails(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleEditMethod = (method: PaymentMethod) => {
    setEditingMethod(method)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingMethod) {
      setPaymentMethods(paymentMethods.map(method => 
        method.id === editingMethod.id
          ? {
              ...method,
              name: newMethod.name || method.name,
              last4: newMethod.type === "credit" 
                ? (newMethod.number ? newMethod.number.slice(-4) : method.last4)
                : (newMethod.accountNumber ? newMethod.accountNumber.slice(-4) : method.last4),
              expiry: newMethod.type === "credit" ? (newMethod.expiry || method.expiry) : undefined,
            }
          : method
      ))
      setEditingMethod(null)
      setAlert({ type: 'success', message: 'Payment method updated successfully!' })
    }
  }

  return (
    <div className="container mx-auto px-4">
      {alert && (
        <Alert className="mb-4" variant={alert.type === 'success' ? 'default' : 'destructive'}>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent>
            {paymentMethods.map((method) => (
              <div key={method.id} className="mb-4 mt-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-semibold">{method.type === "credit" ? "Credit Card" : "Bank Account"}</span>
                  </div>
                  <div>
                    <Button variant="ghost" size="icon" onClick={() => handleToggleDetails(method.id)}>
                      {showFullDetails[method.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleEditMethod(method)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Payment Method</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSaveEdit} className="space-y-4">
                          <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="editName">Name on {method.type === "credit" ? "Card" : "Account"}</Label>
                            <Input 
                              id="editName" 
                              defaultValue={method.name}
                              onChange={(e) => setNewMethod({...newMethod, name: e.target.value})}
                              required
                            />
                          </div>
                          {method.type === "credit" && (
                            <>
                              <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="editNumber">Card Number</Label>
                                <Input 
                                  id="editNumber" 
                                  defaultValue={`**** **** **** ${method.last4}`}
                                  onChange={(e) => setNewMethod({...newMethod, number: e.target.value})}
                                  required
                                />
                              </div>
                              <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="editExpiry">Expiry Date</Label>
                                <Input 
                                  id="editExpiry" 
                                  defaultValue={method.expiry}
                                  onChange={(e) => setNewMethod({...newMethod, expiry: e.target.value})}
                                  required
                                />
                              </div>
                            </>
                          )}
                          {method.type === "bank" && (
                            <div className="grid w-full items-center gap-1.5">
                              <Label htmlFor="editAccountNumber">Account Number</Label>
                              <Input 
                                id="editAccountNumber" 
                                defaultValue={`**** **** **** ${method.last4}`}
                                onChange={(e) => setNewMethod({...newMethod, accountNumber: e.target.value})}
                                required
                              />
                            </div>
                          )}
                          <Button type="submit">Save Changes</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteMethod(method.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-stone-600">
                  {showFullDetails[method.id] ? (
                    <>
                      <p>Name: {method.name}</p>
                      <p>{method.type === "credit" ? `Card number: **** **** **** ${method.last4}` : `Account number: **** **** **** ${method.last4}`}</p>
                      {method.type === "credit" && <p>Expiry: {method.expiry}</p>}
                    </>
                  ) : (
                    <p>{method.type === "credit" ? `**** ${method.last4}` : `**** ${method.last4}`}</p>
                  )}
                </div>
                <div className="mt-2">
                  <Checkbox 
                    id={`default-${method.id}`} 
                    checked={method.isDefault}
                    onCheckedChange={() => handleSetDefault(method.id)}
                  />
                  <label htmlFor={`default-${method.id}`} className="ml-2 text-sm">
                    Set as default
                  </label>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add New Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddNewMethod} className="space-y-4">
              <RadioGroup 
                value={newMethod.type} 
                onValueChange={(value: "credit" | "bank") => setNewMethod({...newMethod, type: value})}
                className="flex space-x-4 mb-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit" id="credit" />
                  <Label htmlFor="credit">Credit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank">Bank Account</Label>
                </div>
              </RadioGroup>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">Name on {newMethod.type === "credit" ? "Card" : "Account"}</Label>
                <Input 
                  id="name" 
                  value={newMethod.name}
                  onChange={(e) => setNewMethod({...newMethod, name: e.target.value})}
                  required
                />
              </div>

              {newMethod.type === "credit" ? (
                <>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="number">Card Number</Label>
                    <Input 
                      id="number" 
                      value={newMethod.number}
                      onChange={(e) => setNewMethod({...newMethod, number: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input 
                        id="expiry" 
                        placeholder="MM/YY"
                        value={newMethod.expiry}
                        onChange={(e) => setNewMethod({...newMethod, expiry: e.target.value})}
                        required
                      />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv" 
                        value={newMethod.cvv}
                        onChange={(e) => setNewMethod({...newMethod, cvv: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input 
                      id="accountNumber" 
                      value={newMethod.accountNumber}
                      onChange={(e) => setNewMethod({...newMethod, accountNumber: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="routingNumber">Routing Number</Label>
                    <Input 
                      id="routingNumber" 
                      value={newMethod.routingNumber}
                      onChange={(e) => setNewMethod({...newMethod, routingNumber: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input 
                      id="bankName" 
                      value={newMethod.bankName}
                      onChange={(e) => setNewMethod({...newMethod, bankName: e.target.value})}
                      required
                    />
                  </div>
                  <RadioGroup 
                    value={newMethod.accountType} 
                    onValueChange={(value: "checking" | "savings") => setNewMethod({...newMethod, accountType: value})}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="checking" id="checking" />
                      <Label htmlFor="checking">Checking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="savings" id="savings" />
                      <Label htmlFor="savings">Savings</Label>
                    </div>
                  </RadioGroup>
                </>
              )}
              
              <Button type="submit">Add Payment Method</Button>
            </form>
          </CardContent>
        
        </Card>
      </div>
    </div>
  )
}

export default ManagePaymentMethods