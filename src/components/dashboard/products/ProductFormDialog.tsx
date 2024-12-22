import { FC, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductFormDialogProps } from "./products-types";
import { useTranslation } from "react-i18next";
import CurrencySelect from "./CurrencySelect";
import { productCategories, Unit } from "./productUnits";

const ProductFormDialog: FC<ProductFormDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  newProduct,
  setNewProduct,
  handleAddProduct,
  handleEditProduct,
  editingProduct,
}) => {
  const { t } = useTranslation("categoriesAndProducts");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    newProduct.productCategory || ""
  );

  const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);

  useEffect(() => {
    if (selectedCategory) {
      const category = productCategories.find(
        (cat) => cat.value === selectedCategory
      );
      if (category) {
        setAvailableUnits(category.units);
        // If the current productUnit is not in the new available units, reset it
        if (
          !category.units.some((unit) => unit.value === newProduct.productUnit)
        ) {
          setNewProduct({ ...newProduct, productUnit: "" });
        }
      } else {
        setAvailableUnits([]);
      }
    } else {
      setAvailableUnits([]);
      setNewProduct({ ...newProduct, productUnit: "" });
    }
  }, [selectedCategory, setNewProduct, newProduct.productUnit]);

  useEffect(() => {
    setSelectedCategory(newProduct.productCategory || "");
  }, [newProduct.productCategory]);

  useEffect(() => {
    if (!isDialogOpen) {
      setNewProduct({
        name: "",
        description: "",
        status: "DRAFT",
        price: 0,
        currency: "USD",
        quantityInStock: 0,
        lowLimitAlert: 0,
        productUnit: "PCS",
        productCategory: "",
        category: { id: 0, description: "", icon: "" },
        quantity: 0,
      });
      setSelectedCategory("");
    }
  }, [isDialogOpen, setNewProduct]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingProduct
              ? t("products.formDialog.edit")
              : t("products.formDialog.add")}
          </DialogTitle>
          <DialogDescription>
            {editingProduct
              ? t("products.formDialog.editDetails")
              : t("products.formDialog.enterDetails")}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            editingProduct ? handleEditProduct() : handleAddProduct();
          }}
          className="space-y-4 mt-4"
        >
          <div>
            <Label htmlFor="name">{t("products.formDialog.name")}</Label>
            <Input
              id="name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="status">{t("products.formDialog.status")}</Label>
            <Select
              value={newProduct.status}
              onValueChange={(value) =>
                setNewProduct({
                  ...newProduct,
                  status: value as "ACTIVE" | "DRAFT",
                })
              }
            >
              <SelectTrigger id="status">
                <SelectValue
                  placeholder={t("products.formDialog.selectStatus")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="price">{t("products.formDialog.price")}</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="currency">
                {t("products.formDialog.currency")}
              </Label>
              <CurrencySelect
                value={newProduct.currency}
                onChange={(value) =>
                  setNewProduct({ ...newProduct, currency: value })
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="quantity">{t("products.formDialog.inStock")}</Label>
            <Input
              id="quantity"
              type="number"
              value={newProduct.quantityInStock}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  quantityInStock: parseInt(e.target.value),
                })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="lowLimitAlert">
              {t("products.formDialog.lowStock")}
            </Label>
            <Input
              id="lowLimitAlert"
              type="number"
              value={newProduct.lowLimitAlert}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  lowLimitAlert: parseInt(e.target.value),
                })
              }
              required
            />
          </div>
          {/* Category Selection */}
          <div>
            <Label htmlFor="productCategory">
              {t("products.formDialog.selectCategory")}
            </Label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value);
                setNewProduct({ ...newProduct, productCategory: value });
              }}
            >
              <SelectTrigger id="productCategory">
                <SelectValue
                  placeholder={t("products.formDialog.selectCategory")}
                />
              </SelectTrigger>
              <SelectContent>
                {productCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {t(category.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Unit Selection */}
          <div>
            <Label htmlFor="productUnit">
              {t("products.formDialog.productUnit")}
            </Label>
            <Select
              value={newProduct.productUnit}
              onValueChange={(value) =>
                setNewProduct({ ...newProduct, productUnit: value })
              }
              disabled={!selectedCategory}
            >
              <SelectTrigger id="productUnit">
                <SelectValue
                  placeholder={
                    selectedCategory
                      ? t("products.formDialog.selectUnit")
                      : t("products.formDialog.selectCategoryFirst")
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableUnits.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {t(unit.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">
              {t("products.formDialog.description")}
            </Label>
            <Input
              id="description"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              {t("products.formDialog.cancel")}
            </Button>
            <Button type="submit">
              {editingProduct
                ? t("products.formDialog.updateProduct")
                : t("products.formDialog.addProduct")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
