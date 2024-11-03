import { FC, useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Search, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductTable from "./ProductTable";
import ProductFilter from "./ProductFilter";
import ProductFormDialog from "./ProductFormDialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useKeycloak } from "@react-keycloak/web";

interface Category {
  id: number;
  description: string;
  icon: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  status: "ACTIVE" | "DRAFT";
  price: number;
  quantityInStock: number;
  lowLimitAlert: number;
  productUnit: string;
  createdAt: string;
  category: Category;
}

const ProductsPage: FC = () => {
  const [activeTab, setActiveTab] = useState<"All" | "ACTIVE" | "DRAFT">("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [newProduct, setNewProduct] = useState<Omit<Product, "id" | "createdAt">>({
    name: "",
    description: "",
    status: "DRAFT",
    price: 0,
    quantityInStock: 0,
    lowLimitAlert: 0,
    productUnit: "PCS",
    category: { id: 1, description: "", icon: "" },
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });

  const { selectedCategoryId, selectedCategoryDescription } = useOutletContext<{
    selectedCategoryId: number;
    selectedCategoryDescription: string;
  }>();
  const { keycloak } = useKeycloak();

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:9090/api/v1/product/list", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setProducts(data.data.filter((product: Product) => product.category?.id === selectedCategoryId));
      } else {
        console.error("Error fetching products:", data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    if (selectedCategoryId) {
      fetchProducts();
    }
  }, [selectedCategoryId, keycloak.token]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = product.category.id === selectedCategoryId;
    const matchesTab = activeTab === "All" || product.status === activeTab;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDateRange =
      (dateRange.from === undefined && dateRange.to === undefined) ||
      (dateRange.from && dateRange.to && new Date(product.createdAt) >= dateRange.from && new Date(product.createdAt) <= dateRange.to);
    const matchesPriceRange = product.price >= priceRange.min && product.price <= priceRange.max;
    return matchesCategory && matchesTab && matchesSearch && matchesDateRange && matchesPriceRange;
  });

  const lowStockProducts = products.filter((product) => product.quantityInStock <= product.lowLimitAlert);

  const handleAddProduct = async () => {
    const productToAdd = {
      ...newProduct,
      createdAt: new Date().toISOString(),
      category: { id: selectedCategoryId, description: selectedCategoryDescription },
    };
  
    try {
      const response = await fetch("http://localhost:9090/api/v1/product/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: JSON.stringify(productToAdd),
      });
  
      const createdProduct = await response.json();
  
      // Check if the response was successful and if the product data is available
      if (response.ok && createdProduct.success && createdProduct.data) {
        console.log("Product created:", createdProduct.data); // Debugging output
  
        // Add the new product to the state
        setProducts((prevProducts) => [...prevProducts, createdProduct.data]);
        
        // Reset form and dialog state
        setIsDialogOpen(false);
        resetProductForm();
      } else {
        console.error("Error adding product:", createdProduct);
      }
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };
  
  
  

  const handleEditProduct = async () => {
    if (editingProduct && editingProduct.id) {
      try {
        const response = await fetch(`http://localhost:9090/api/v1/product/update/${editingProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keycloak.token}`,
          },
          body: JSON.stringify({ ...newProduct, category: editingProduct.category }),
        });
        const updatedProduct = await response.json();
        if (response.ok) {
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id === editingProduct.id ? updatedProduct.data : product
            )
          );
          setIsDialogOpen(false);
          resetProductForm();
          setEditingProduct(null); // Clear editing state after successful edit
        } else {
          console.error("Error updating product:", updatedProduct);
        }
      } catch (error) {
        console.error("Failed to edit product:", error);
      }
    } else {
      console.error("Editing product is not set or has no ID.");
    }
  };
  

  const handleDeleteProduct = async (productId: number) => {
    try {
      const response = await fetch(`http://localhost:9090/api/v1/product/delete/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });
      if (response.ok) {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
      } else {
        console.error("Failed to delete product:", await response.json());
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const resetProductForm = () => {
    setNewProduct({
      name: "",
      description: "",
      status: "DRAFT",
      price: 0,
      quantityInStock: 0,
      lowLimitAlert: 0,
      productUnit: "PCS",
      category: { id: selectedCategoryId, description: "", icon: "" },
    });
    setEditingProduct(null);
  };

  const handleExport = () => {
    const headers = ["Name", "Status", "Price", "Quantity in Stock", "Low Limit Alert", "Product Unit", "Created At"];
    const csvContent = [
      headers.join(","),
      ...filteredProducts.map((product) =>
        [product.name, product.status, product.price, product.quantityInStock, product.lowLimitAlert, product.productUnit, product.createdAt].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "products.csv");
      link.style.visibility = "hidden";
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

      {lowStockProducts.length > 0 && (
        <Alert variant="destructive">
          <AlertTitle>Low Stock Alert</AlertTitle>
          <AlertDescription>Some products are below the low stock limit!</AlertDescription>
        </Alert>
      )}

      {filteredProducts.length === 0 && (
        <Alert variant="default">
          <AlertTitle>No products found</AlertTitle>
          <AlertDescription>No products available for this category.</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          {["All", "ACTIVE", "DRAFT"].map((tab) => (
            <button
              key={tab}
              className={`px-3 py-2 text-sm font-medium ${activeTab === tab ? "text-stone-900 dark:text-stone-100 border-b-2 border-stone-900 dark:border-stone-100" : "text-stone-500 dark:text-stone-400"}`}
              onClick={() => setActiveTab(tab as "All" | "ACTIVE" | "DRAFT")}
            >
              {tab === "All" ? tab : tab === "ACTIVE" ? "Active" : "Draft"}
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
        openEditDialog={(product) => {
          setEditingProduct(product);
          setNewProduct({ ...product });
          setIsDialogOpen(true);
        }}
        handleDeleteProduct={handleDeleteProduct}
        lowStockProducts={lowStockProducts}
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
