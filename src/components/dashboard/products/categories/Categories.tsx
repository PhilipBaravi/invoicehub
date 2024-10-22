import { FC, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
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
import {
  Trash2,
  Pencil,
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
  LucideIcon,
} from "lucide-react";

// Import AlertDialog components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryList | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryList | null>(null); // Track category to delete
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Track dialog open state

  const navigate = useNavigate();

  const handleAddCategory = (newCategory: CategoryList) => {
    setProductCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  const handleEditCategory = (updatedCategory: CategoryList) => {
    setProductCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
    setIsEditDialogOpen(false);
  };

  // Deleting category only after confirmation
  const confirmDeleteCategory = () => {
    if (categoryToDelete !== null) {
      setProductCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryToDelete.id)
      );
      setCategoryToDelete(null); // Reset the delete state
      setIsDeleteDialogOpen(false); // Close the dialog
    }
  };

  // Function to trigger the delete confirmation dialog
  const openDeleteDialog = (category: CategoryList) => {
    setCategoryToDelete(category); // Set the category to delete
    setIsDeleteDialogOpen(true); // Open the dialog
  };

  const openEditDialog = (category: CategoryList) => {
    setCategoryToEdit(category);
    setIsEditDialogOpen(true);
  };

  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    navigate(`/dashboard/categories/products`);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 w-full px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories ({productCategories.length})</h1>
        <AddCategoryBtn onAddCategory={handleAddCategory} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {productCategories.map((category) => {
          const Icon = iconMap[category.icon];

          return (
            <ContextMenu key={category.id}>
              <ContextMenuTrigger>
                <Card
                  className={`cursor-pointer transition-colors ${
                    selectedCategoryId === category.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  }`}
                  onClick={() => handleSelectCategory(category.id)}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    {Icon && <Icon className="h-6 w-6" />}
                    <h2 className="mt-2 font-semibold">{category.description}</h2>
                  </CardContent>
                </Card>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => openDeleteDialog(category)}>
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

      {categoryToEdit && (
        <EditCategoryBtn
          category={categoryToEdit}
          onEditCategory={handleEditCategory}
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCategory}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Outlet context={{ selectedCategoryId }} />
    </div>
  );
};

export default Categories;
