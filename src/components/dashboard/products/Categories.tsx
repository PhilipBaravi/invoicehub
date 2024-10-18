import { FC, useState } from "react";
import { Link } from "react-router-dom";
import AddCategoryBtn from "./AddCategoryBtn";
import { Card, CardContent } from "@/components/ui/card";
import { productCategories as initialCategories, productCategoriesProps } from "./productCategories";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Trash2 } from "lucide-react"

const Categories: FC = () => {
  const [productCategories, setProductCategories] = useState<productCategoriesProps[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleAddCategory = (newCategory: productCategoriesProps) => {
    setProductCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  const handleDeleteCategory = (categoryName: string) => {
    setProductCategories((prevCategories) => 
      prevCategories.filter((category) => category.name !== categoryName)
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories ({productCategories.length})</h1>
        <AddCategoryBtn onAddCategory={handleAddCategory} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {productCategories.map((category) => {
          const Icon = category.icon;

          return (
            <ContextMenu key={category.name}>
              <ContextMenuTrigger>
                <Link to="/dashboard/products">
                  <Card
                    className={`cursor-pointer transition-colors ${
                      selectedCategory === category.name
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    }`}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <Icon className="h-6 w-6" />
                      <h2 className="mt-2 font-semibold">{category.name}</h2>
                      <p className="text-sm">{category.count} Product{category.count !== 1 ? 's' : ''}</p>
                    </CardContent>
                  </Card>
                </Link>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => handleDeleteCategory(category.name)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;