import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductFormDialogProps } from "./products-types";
import { useTranslation } from "react-i18next";

const ProductFormDialog: FC<ProductFormDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  newProduct,
  setNewProduct,
  handleAddProduct,
  handleEditProduct,
  editingProduct,
}) => {
  const { t } = useTranslation('categoriesAndProducts')
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingProduct ? t('products.formDialog.edit') : t('products.formDialog.add')}</DialogTitle>
          <DialogDescription>
            {editingProduct ? t('products.formDialog.editDetails') : t('products.formDialog.enterDetails')}
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
            <Label htmlFor="name">{t('products.formDialog.name')}</Label>
            <Input
              id="name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="status">{t('products.formDialog.status')}</Label>
            <Select
              value={newProduct.status}
              onValueChange={(value) => setNewProduct({ ...newProduct, status: value as "ACTIVE" | "DRAFT" })}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="price">{t('products.formDialog.price')}</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="quantity">{t('products.formDialog.inStock')}</Label>
            <Input
              id="quantity"
              type="number"
              value={newProduct.quantityInStock}
              onChange={(e) => setNewProduct({ ...newProduct, quantityInStock: parseInt(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="lowLimitAlert">{t('products.formDialog.lowStock')}</Label>
            <Input
              id="lowLimitAlert"
              type="number"
              value={newProduct.lowLimitAlert}
              onChange={(e) => setNewProduct({ ...newProduct, lowLimitAlert: parseInt(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="productUnit">{t('products.formDialog.productUnit')}</Label>
            <Input
              id="productUnit"
              value={newProduct.productUnit}
              onChange={(e) => setNewProduct({ ...newProduct, productUnit: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">{t('products.formDialog.description')}</Label>
            <Input
              id="description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
            {t('products.formDialog.cancel')}
            </Button>
            <Button type="submit">{editingProduct ? t('products.formDialog.updateProduct') : t('products.formDialog.addProduct')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
