import { FC, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom"; // Added useNavigate
import AddCategoryBtn from "./AddCategoryBtn";
import EditCategoryBtn from "./EditCategoryBtn";
import { Card, CardContent } from "@/components/ui/card";
import testCategoryListData, { CategoryList } from "./test-category-list-data";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Trash2, Pencil, ShoppingBag, Airplay, Aperture, Book, Box, Cake, Car, Coffee, Droplet, Home, Laptop, Leaf, Utensils, LucideIcon } from "lucide-react";

// Map of string icon names to actual Lucide icons
const iconMap: Record<string, LucideIcon> = {
  ShoppingBag,
  Airplay,
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
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null); // Now we track category ID
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryList | null>(null); // For editing
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // Controls dialog open state

  const navigate = useNavigate(); // For navigation

  // Function to handle adding new category
  const handleAddCategory = (newCategory: CategoryList) => {
    setProductCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  // Function to handle editing category
  const handleEditCategory = (updatedCategory: CategoryList) => {
    setProductCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
    setIsEditDialogOpen(false); // Close the edit dialog
  };

  // Function to handle deleting category
  const handleDeleteCategory = (categoryId: number) => {
    setProductCategories((prevCategories) =>
      prevCategories.filter((category) => category.id !== categoryId)
    );
  };

  // Function to trigger the edit dialog
  const openEditDialog = (category: CategoryList) => {
    setCategoryToEdit(category); // Set the selected category for editing
    setIsEditDialogOpen(true); // Open the dialog
  };

  // Function to select a category and navigate to products
  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategoryId(categoryId); // Set the selected category ID
    navigate(`/dashboard/categories/products`); // Navigate to products page
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 w-full px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories ({productCategories.length})</h1>
        <AddCategoryBtn onAddCategory={handleAddCategory} /> {/* Pass the add function */}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {productCategories.map((category) => {
          const Icon = iconMap[category.icon]; // Map string icon name to actual Lucide icon

          return (
            <ContextMenu key={category.id}>
              <ContextMenuTrigger>
                <Card
                  className={`cursor-pointer transition-colors ${
                    selectedCategoryId === category.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  }`}
                  onClick={() => handleSelectCategory(category.id)} // Handle category selection
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    {Icon && <Icon className="h-6 w-6" />} {/* Display icon if found */}
                    <h2 className="mt-2 font-semibold">{category.description}</h2>
                  </CardContent>
                </Card>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => handleDeleteCategory(category.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </ContextMenuItem>
                <ContextMenuItem onClick={() => openEditDialog(category)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          );
        })}
      </div>

      {/* Edit Category Dialog */}
      {categoryToEdit && (
        <EditCategoryBtn
          category={categoryToEdit}
          onEditCategory={handleEditCategory}
          isOpen={isEditDialogOpen} // Pass the dialog open state
          setIsOpen={setIsEditDialogOpen} // Control the dialog close
        />
      )}

      {/* Nested Route Content */}
      <Outlet context={{ selectedCategoryId }} /> {/* Pass the selectedCategoryId to child components */}
    </div>
  );
};

export default Categories;
