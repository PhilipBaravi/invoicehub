import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Category {
  id: number;
  description: string;
  icon: string;
}

interface Product {
  name: string;
  status: "ACTIVE" | "DRAFT"; // Updated to match backend data
  price: number;
  quantityInStock: number;
  lowLimitAlert: number;
  productUnit: string;
  description: string;
  category: Category;
}

interface ProductFormDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  newProduct: Product;
  setNewProduct: (product: Product) => void;
  handleAddProduct: () => void;
  handleEditProduct: () => void;
  editingProduct: Product | null;
}

const ProductFormDialog: FC<ProductFormDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  newProduct,
  setNewProduct,
  handleAddProduct,
  handleEditProduct,
  editingProduct,
}) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {editingProduct ? 'Edit the details of the product below.' : 'Enter the details of the new product below.'}
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
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
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
            <Label htmlFor="price">Price</Label>
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
            <Label htmlFor="quantity">Quantity in Stock</Label>
            <Input
              id="quantity"
              type="number"
              value={newProduct.quantityInStock}
              onChange={(e) => setNewProduct({ ...newProduct, quantityInStock: parseInt(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="lowLimitAlert">Low Stock Alert</Label>
            <Input
              id="lowLimitAlert"
              type="number"
              value={newProduct.lowLimitAlert}
              onChange={(e) => setNewProduct({ ...newProduct, lowLimitAlert: parseInt(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="productUnit">Product Unit</Label>
            <Input
              id="productUnit"
              value={newProduct.productUnit}
              onChange={(e) => setNewProduct({ ...newProduct, productUnit: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
