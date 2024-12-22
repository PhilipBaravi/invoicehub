export interface Category {
  id: number;
  description: string;
  icon: string;
}

export interface Product {
  quantity: number;
  id: number;
  name: string;
  description: string;
  status: "ACTIVE" | "DRAFT";
  price: number;
  currency: string;
  quantityInStock: number;
  lowLimitAlert: number;
  productUnit: string;
  createdAt: string;
  category: Category;
  productCategory?: string;
}

export interface ProductTableProps {
  products: Product[];
  openEditDialog: (product: Product) => void;
  handleDeleteProduct: (productId: number) => void;
  lowStockProducts: Product[];
}

export interface ProductFormDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  newProduct: Omit<Product, "id" | "createdAt">;
  setNewProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  handleAddProduct: () => void;
  handleEditProduct: () => void;
  editingProduct: Product | null;
}

export interface ProductFilterProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  setDateRange: (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
  priceRange: { min: number; max: number };
  setPriceRange: (range: { min: number; max: number }) => void;
}
