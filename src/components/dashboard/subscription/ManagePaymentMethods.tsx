import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CreditCard,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { PaymentMethod } from "./types";

const ManagePaymentMethods: FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "credit",
      last4: "4242",
      expiry: "12/24",
      name: "John Doe",
      isDefault: true,
    },
    {
      id: "2",
      type: "bank",
      last4: "1234",
      name: "Jane Doe",
      isDefault: false,
    },
  ]);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(
    null
  );
  const [showFullDetails, setShowFullDetails] = useState<
    Record<string, boolean>
  >({});
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const { t } = useTranslation("settings");

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
  });

  const handleAddNewMethod = (e: React.FormEvent) => {
    e.preventDefault();
    const newPaymentMethod: PaymentMethod = {
      id: `new-${Date.now()}`,
      type: newMethod.type,
      last4:
        newMethod.type === "credit"
          ? newMethod.number.slice(-4)
          : newMethod.accountNumber.slice(-4),
      expiry: newMethod.type === "credit" ? newMethod.expiry : undefined,
      name: newMethod.name,
      isDefault: paymentMethods.length === 0,
    };
    setPaymentMethods([...paymentMethods, newPaymentMethod]);
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
    });
    setAlert({ type: "success", message: t("payment.paymentSuccess") });
  };

  const handleDeleteMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
    setAlert({ type: "success", message: t("payment.paymentDeleted") });
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
    setAlert({ type: "success", message: t("payment.paymentDefault") });
  };

  const handleToggleDetails = (id: string) => {
    setShowFullDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEditMethod = (method: PaymentMethod) => {
    setEditingMethod(method);
    setNewMethod({
      type: method.type,
      name: method.name,
      number: method.type === "credit" ? `**** **** **** ${method.last4}` : "",
      expiry: method.expiry || "",
      cvv: "",
      accountNumber:
        method.type === "bank" ? `**** **** **** ${method.last4}` : "",
      routingNumber: "",
      bankName: "",
      accountType:
        method.type === "bank"
          ? (newMethod.accountType as "checking" | "savings")
          : "checking",
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMethod) {
      setPaymentMethods(
        paymentMethods.map((method) =>
          method.id === editingMethod.id
            ? {
                ...method,
                name: newMethod.name || method.name,
                last4:
                  newMethod.type === "credit"
                    ? newMethod.number.slice(-4)
                    : newMethod.accountNumber.slice(-4),
                expiry:
                  newMethod.type === "credit"
                    ? newMethod.expiry || method.expiry
                    : undefined,
              }
            : method
        )
      );
      setEditingMethod(null);
      setAlert({ type: "success", message: t("payment.paymentUpdate") });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {alert && (
        <Alert
          className="mb-6"
          variant={alert.type === "success" ? "default" : "destructive"}
        >
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>{t("payment.success")}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t("payment.existingMethods")}</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="mb-6 p-4 border rounded-lg shadow-sm"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-semibold">
                      {method.type === "credit"
                        ? t("payment.creditCard")
                        : t("payment.bankAccount")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleDetails(method.id)}
                    >
                      {showFullDetails[method.id] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditMethod(method)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>{t("payment.editMethod")}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSaveEdit} className="space-y-4">
                          <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="editName">
                              {t("payment.nameOn")}{" "}
                              {method.type === "credit"
                                ? t("payment.card")
                                : t("payment.account")}
                            </Label>
                            <Input
                              id="editName"
                              defaultValue={method.name}
                              onChange={(e) =>
                                setNewMethod({
                                  ...newMethod,
                                  name: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          {method.type === "credit" && (
                            <>
                              <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="editNumber">
                                  {t("payment.cardNumber")}
                                </Label>
                                <Input
                                  id="editNumber"
                                  defaultValue={`**** **** **** ${method.last4}`}
                                  onChange={(e) =>
                                    setNewMethod({
                                      ...newMethod,
                                      number: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="editExpiry">
                                  {t("payment.expiryDate")}
                                </Label>
                                <Input
                                  id="editExpiry"
                                  defaultValue={method.expiry}
                                  onChange={(e) =>
                                    setNewMethod({
                                      ...newMethod,
                                      expiry: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                            </>
                          )}
                          {method.type === "bank" && (
                            <div className="grid w-full items-center gap-1.5">
                              <Label htmlFor="editAccountNumber">
                                {t("payment.accountNo")}
                              </Label>
                              <Input
                                id="editAccountNumber"
                                defaultValue={`**** **** **** ${method.last4}`}
                                onChange={(e) =>
                                  setNewMethod({
                                    ...newMethod,
                                    accountNumber: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                          )}
                          <Button type="submit">{t("payment.save")}</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMethod(method.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-stone-600">
                  {showFullDetails[method.id] ? (
                    <>
                      <p>
                        {t("payment.name")} {method.name}
                      </p>
                      <p>
                        {method.type === "credit"
                          ? `${t("payment.cardNumber")}: **** **** **** ${
                              method.last4
                            }`
                          : `${t("payment.accountNo")}: **** **** **** ${
                              method.last4
                            }`}
                      </p>
                      {method.type === "credit" && (
                        <p>
                          {t("payment.expiry")}: {method.expiry}
                        </p>
                      )}
                    </>
                  ) : (
                    <p>
                      {method.type === "credit"
                        ? `**** ${method.last4}`
                        : `**** ${method.last4}`}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex items-center">
                  <Checkbox
                    id={`default-${method.id}`}
                    checked={method.isDefault}
                    onCheckedChange={() => handleSetDefault(method.id)}
                  />
                  <label
                    htmlFor={`default-${method.id}`}
                    className="ml-2 text-sm"
                  >
                    {t("payment.setDefault")}
                  </label>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t("payment.addNew")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddNewMethod} className="space-y-6">
              <RadioGroup
                value={newMethod.type}
                onValueChange={(value: "credit" | "bank") =>
                  setNewMethod({ ...newMethod, type: value })
                }
                className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit" id="credit" />
                  <Label htmlFor="credit">{t("payment.creditCard")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank">{t("payment.bankAccount")}</Label>
                </div>
              </RadioGroup>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">
                  {t("payment.nameOn")}{" "}
                  {newMethod.type === "credit"
                    ? t("payment.card")
                    : t("payment.account")}
                </Label>
                <Input
                  id="name"
                  value={newMethod.name}
                  onChange={(e) =>
                    setNewMethod({ ...newMethod, name: e.target.value })
                  }
                  required
                />
              </div>

              {newMethod.type === "credit" ? (
                <>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="number">{t("payment.cardNumber")}</Label>
                    <Input
                      id="number"
                      value={newMethod.number}
                      onChange={(e) =>
                        setNewMethod({ ...newMethod, number: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="expiry">{t("payment.expiryDate")}</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={newMethod.expiry}
                        onChange={(e) =>
                          setNewMethod({ ...newMethod, expiry: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="cvv">{t("payment.cvv")}</Label>
                      <Input
                        id="cvv"
                        value={newMethod.cvv}
                        onChange={(e) =>
                          setNewMethod({ ...newMethod, cvv: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="accountNumber">
                      {t("payment.accountNo")}
                    </Label>
                    <Input
                      id="accountNumber"
                      value={newMethod.accountNumber}
                      onChange={(e) =>
                        setNewMethod({
                          ...newMethod,
                          accountNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="routingNumber">
                      {t("payment.routingNo")}
                    </Label>
                    <Input
                      id="routingNumber"
                      value={newMethod.routingNumber}
                      onChange={(e) =>
                        setNewMethod({
                          ...newMethod,
                          routingNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="bankName">{t("payment.bankName")}</Label>
                    <Input
                      id="bankName"
                      value={newMethod.bankName}
                      onChange={(e) =>
                        setNewMethod({ ...newMethod, bankName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <RadioGroup
                    value={newMethod.accountType}
                    onValueChange={(value: "checking" | "savings") =>
                      setNewMethod({ ...newMethod, accountType: value })
                    }
                    className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="checking" id="checking" />
                      <Label htmlFor="checking">{t("payment.checking")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="savings" id="savings" />
                      <Label htmlFor="savings">{t("payment.savings")}</Label>
                    </div>
                  </RadioGroup>
                </>
              )}

              <Button type="submit" className="w-full">
                {t("payment.addPaymentMethod")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagePaymentMethods;
