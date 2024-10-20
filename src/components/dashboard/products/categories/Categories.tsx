import { FC, useState } from "react";
import { Link } from "react-router-dom";
import AddCategoryBtn from "./AddCategoryBtn";
import EditCategoryBtn from "./EditCategoryBtn";
import { Card, CardContent } from "@/components/ui/card";
import testCategoryListData from "./test-category-list-data";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Trash2 } from "lucide-react";
import { LucideIcon, Airplay, ShoppingBag, Aperture, Book, Box, Cake, Car, Coffee, Droplet, Home, Laptop, Leaf, Utensils } from "lucide-react"; // Import all icons directly

// Map of string icon names to actual Lucide icons
const iconMap: Record<string, LucideIcon> = {
  Airplay,
  ShoppingBag,
  Aperture,
  Book,
  Box,
  Cake,
  Car,
  Coffee,
  Droplet,
  Home,
  Laptop,
  Leaf,
  Utensils,
};

const Categories: FC = () => {
  const [productCategories, setProductCategories] = useState(testCategoryListData.data);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleDeleteCategory = (categoryId: number) => {
    setProductCategories((prevCategories) =>
      prevCategories.filter((category) => category.id !== categoryId)
    );
  };

  const handleEditCategory = (updatedCategory: any) => {
    setProductCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories ({productCategories.length})</h1>
        <AddCategoryBtn onAddCategory={() => {}} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {productCategories.map((category) => {
          const Icon = iconMap[category.icon];

          return (
            <ContextMenu key={category.id}>
              <ContextMenuTrigger>
                <Link to="/dashboard/products">
                  <Card
                    className={`cursor-pointer transition-colors ${
                      selectedCategory === category.description
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    }`}
                    onClick={() => setSelectedCategory(category.description)}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      {Icon && <Icon className="h-6 w-6" />}
                      <h2 className="mt-2 font-semibold">{category.description}</h2>
                      <p className="text-sm">Products: Will Get Data From Products Data</p>
                    </CardContent>
                  </Card>
                </Link>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => handleDeleteCategory(category.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </ContextMenuItem>
                <ContextMenuItem>
                  {/* Use EditCategoryBtn here */}
                  <EditCategoryBtn 
                    category={category} 
                    onEditCategory={handleEditCategory} 
                  />
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
