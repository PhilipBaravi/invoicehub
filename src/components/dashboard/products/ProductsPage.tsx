import { FC, useState } from "react";
import { useOutletContext } from "react-router-dom"; // Import useOutletContext to get the category ID
import { Search, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductTable from "./ProductTable";
import ProductFilter from "./ProductFilter";
import ProductFormDialog from "./ProductFormDialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; // Use ShadCN UI alert
import testProductListData from "./test-product-list-data";

interface Category {
  id: number;
  description: string;
  icon: string;
}

interface Product {
  id: number;
  name: string;
  status: "Active" | "Draft";
  price: number;
  quantityInStock: number;
  lowLimitAlert: number;
  productUnit: string;
  createdAt: string;
  category: Category;
}

const ProductsPage: FC = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>(testProductListData.data);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'createdAt'>>({
    name: '',
    status: 'Draft',
    price: 0,
    quantityInStock: 0,
    lowLimitAlert: 0,
    productUnit: 'PCS',
    category: { id: 1, description: '', icon: '' }, // Default category structure
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });

  // Get the selected category ID from the context
  const { selectedCategoryId } = useOutletContext<{ selectedCategoryId: number }>();

  // Filter products based on the selected category
  const filteredProducts = products.filter((product) => {
    const matchesCategory = product.category.id === selectedCategoryId;
    const matchesTab = activeTab === "All" || product.status === activeTab;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDateRange = (dateRange.from === undefined && dateRange.to === undefined)
      || (dateRange.from && dateRange.to && new Date(product.createdAt) >= dateRange.from && new Date(product.createdAt) <= dateRange.to);
    const matchesPriceRange = product.price >= priceRange.min && product.price <= priceRange.max;

    return matchesCategory && matchesTab && matchesSearch && matchesDateRange && matchesPriceRange;
  });

  const lowStockProducts = products.filter(product => product.quantityInStock <= product.lowLimitAlert);

  const handleAddProduct = () => {
    const product: Product = {
      ...newProduct,
      id: products.length + 1, // Generate new ID
      createdAt: new Date().toLocaleString(),
      category: { id: selectedCategoryId, description: '', icon: '' } // Assign to the selected category
    };

    setProducts((prevProducts) => [...prevProducts, product]);
    setIsDialogOpen(false);
    setNewProduct({
      name: '',
      status: 'Draft',
      price: 0,
      quantityInStock: 0,
      lowLimitAlert: 0,
      productUnit: 'PCS',
      category: { id: selectedCategoryId, description: '', icon: '' }, // Reset with selected category
    });
  };

  const handleEditProduct = () => {
    if (editingProduct) {
      const updatedProducts = products.map(p => p.id === editingProduct.id ? { ...editingProduct, ...newProduct } : p);
      setProducts(updatedProducts);
      setIsDialogOpen(false);
      setEditingProduct(null);
      setNewProduct({
        name: '',
        status: 'Draft',
        price: 0,
        quantityInStock: 0,
        lowLimitAlert: 0,
        productUnit: 'PCS',
        category: { id: selectedCategoryId, description: '', icon: '' }, // Reset with selected category
      });
    }
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts((prevProducts) => prevProducts.filter(product => product.id !== productId));
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      status: product.status,
      price: product.price,
      quantityInStock: product.quantityInStock,
      lowLimitAlert: product.lowLimitAlert,
      productUnit: product.productUnit,
      category: product.category, // Set the existing category
    });
    setIsDialogOpen(true);
  };

  const handleExport = () => {
    const headers = ["Name", "Status", "Price", "Quantity in Stock", "Low Limit Alert", "Product Unit", "Created At"];
    const csvContent = [
      headers.join(","),
      ...filteredProducts.map(product =>
        [product.name, product.status, product.price, product.quantityInStock, product.lowLimitAlert, product.productUnit, product.createdAt].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "products.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Products</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">Manage your products and view their stock levels.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Conditional Alert for low stock */}
      {lowStockProducts.length > 0 && (
        <Alert variant="destructive">
          <AlertTitle>Low Stock Alert</AlertTitle>
          <AlertDescription>Some products are below the low stock limit!</AlertDescription>
        </Alert>
      )}

      {/* Filtered Products Alert */}
      {filteredProducts.length === 0 && (
        <Alert variant="default"> {/* Use default variant */}
          <AlertTitle>No products found</AlertTitle>
          <AlertDescription>No products available for this category.</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          {["All", "Active", "Draft"].map((tab) => (
            <button
              key={tab}
              className={`px-3 py-2 text-sm font-medium ${activeTab === tab ? "text-stone-900 dark:text-stone-100 border-b-2 border-stone-900 dark:border-stone-100" : "text-stone-500 dark:text-stone-400"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500 dark:text-stone-400" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ProductFilter
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            dateRange={dateRange}
            setDateRange={setDateRange}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <ProductTable
        products={filteredProducts}
        openEditDialog={openEditDialog}
        handleDeleteProduct={handleDeleteProduct}
        lowStockProducts={lowStockProducts} // Pass low stock products to table for highlighting
      />

      <ProductFormDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        handleAddProduct={handleAddProduct}
        handleEditProduct={handleEditProduct}
        editingProduct={editingProduct}
      />
    </div>
  );
};

export default ProductsPage;
