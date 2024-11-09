import { FC } from "react";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductTableProps } from "./products-types";
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
import { useTranslation } from "react-i18next";

const ProductTable: FC<ProductTableProps> = ({ products, openEditDialog, handleDeleteProduct, lowStockProducts }) => {
  const { t } = useTranslation('categoriesAndProducts')
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px] text-center">{t('products.table.name')}</TableHead>
            <TableHead className="text-center">{t('products.table.status')}</TableHead>
            <TableHead className="text-center">{t('products.table.price')}</TableHead>
            <TableHead className="text-center">{t('products.table.quantity')}</TableHead>
            <TableHead className="text-center">{t('products.table.description')}</TableHead>
            <TableHead className="text-center">{t('products.table.createdAt')}</TableHead>
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
                <Pencil className="mr-2 h-4 w-4" /> {t('products.table.edit')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} key={`${product.id}-delete`}>
                <Trash className="mr-2 h-4 w-4" /> {t('products.table.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  })}
</TableBody>

      </Table>
      <div className="text-sm text-stone-500 dark:text-stone-400">
      {t('products.table.showing', { count: products.length })}
    </div>
    </>
  );
};

export default ProductTable;
