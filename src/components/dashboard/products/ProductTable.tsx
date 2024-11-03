import { FC } from "react";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Category {
  id: number;
  description: string;
  icon: string;
}

interface Product {
  id: number;
  name: string;
  status: "ACTIVE" | "DRAFT"; // Matches backend data
  price: number;
  quantityInStock: number;
  lowLimitAlert: number;
  productUnit: string;
  createdAt: string;
  description: string;
  category: Category;
}

interface ProductTableProps {
  products: Product[];
  openEditDialog: (product: Product) => void;
  handleDeleteProduct: (productId: number) => void;
  lowStockProducts: Product[];
}

const ProductTable: FC<ProductTableProps> = ({ products, openEditDialog, handleDeleteProduct, lowStockProducts }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px] text-center">Name</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Price</TableHead>
            <TableHead className="text-center">Quantity in Stock</TableHead>
            <TableHead className="text-center">Description</TableHead>
            <TableHead className="text-center">Created at</TableHead>
            <TableHead className="w-[50px] text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
  {products.map((product) => {
    console.log("Rendering product with key:", product.id); // Debugging log
    return (
      <TableRow
        key={product.id}
        className={lowStockProducts.some((lowStockProduct) => lowStockProduct.id === product.id) ? 'bg-red-100 dark:bg-red-900' : ''}
      >
        <TableCell className="text-center">{product.name}</TableCell>
        <TableCell className="text-center">
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              product.status === "ACTIVE"
                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
            }`}
          >
            {product.status === "ACTIVE" ? "Active" : "Draft"}
          </span>
        </TableCell>
        <TableCell className="text-center">${product.price.toFixed(2)}</TableCell>
        <TableCell className="text-center">{product.quantityInStock}</TableCell>
        <TableCell className="text-center max-w-[200px]">{product.description}</TableCell>
        <TableCell className="text-center">{product.createdAt}</TableCell>
        <TableCell className="text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditDialog(product)} key={`${product.id}-edit`}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} key={`${product.id}-delete`}>
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  })}
</TableBody>

      </Table>
      <div className="text-sm text-stone-500 dark:text-stone-400">Showing {products.length} products</div>
    </>
  );
};

export default ProductTable;
