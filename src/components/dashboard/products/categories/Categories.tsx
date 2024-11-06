import { FC, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AddCategoryBtn from "./AddCategoryBtn";
import EditCategoryBtn from "./EditCategoryBtn";
import { Card, CardContent } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Trash2, Pencil } from "lucide-react";
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
import { useKeycloak } from "@react-keycloak/web";

// Import types and icon map
import { Category } from "./categories-types";
import iconMap from "./icons-map";

const Categories: FC = () => {
  const [productCategories, setProductCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const navigate = useNavigate();
  const { keycloak } = useKeycloak();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:9090/api/v1/category/list", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });
        const data = await response.json();
        setProductCategories(data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [keycloak.token]);

  const handleAddCategory = (newCategory: Category) => {
    setProductCategories((prevCategories) => [...prevCategories, newCategory]);
    handleSelectCategory(newCategory.id); // Update selectedCategoryId
  };

  const handleEditCategory = (updatedCategory: Category) => {
    setProductCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
    setIsEditDialogOpen(false);
  };

  const confirmDeleteCategory = async () => {
    if (categoryToDelete) {
      try {
        await fetch(`http://localhost:9090/api/v1/category/delete/${categoryToDelete.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });
        setProductCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== categoryToDelete.id)
        );
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
      setCategoryToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
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

      <Outlet
        context={{
          selectedCategoryId,
          selectedCategoryDescription:
            productCategories.find((category) => category.id === selectedCategoryId)?.description ||
            "",
        }}
      />
    </div>
  );
};

export default Categories;
