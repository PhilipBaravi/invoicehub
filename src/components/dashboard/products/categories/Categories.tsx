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
import { useTranslation } from "react-i18next";

// Import types and icon map
import { Category } from "./categories-types";
import iconMap from "./icons-map";
import { useToast } from "@/hooks/use-toast";

const Categories: FC = () => {
  const [productCategories, setProductCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { t } = useTranslation('categoriesAndProducts')
  const { toast } = useToast();

  const navigate = useNavigate();
  const { keycloak } = useKeycloak();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://api.invoicehub.space/category/list", {
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
        const response = await fetch(`https://api.invoicehub.space/category/delete/${categoryToDelete.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });
        if (!response.ok) {
          const data = await response.json();
          if (response.status === 409 && data.message === "There is at least one product that is used in invoice!") {
            toast({
              title: t('error.title'),
              description: t('error.categoryMessage'),
              variant: "destructive",
              duration: 3000,
            })
          } else {
            console.error("Failed to delete product:", data.message);
          }
          return;
        }
    

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
    <div className="flex flex-1 flex-col gap-2 p-2 sm:gap-4 sm:p-4 md:gap-6 md:p-6 lg:gap-8 lg:p-8 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
          {t('categories.pageTitle')} ({productCategories.length})
        </h1>
        <div className="w-full sm:w-auto">
          <AddCategoryBtn onAddCategory={handleAddCategory} />
        </div>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
        {productCategories.map((category) => {
          const Icon = iconMap[category.icon];
          return (
            <ContextMenu key={category.id}>
              <ContextMenuTrigger>
                <Card
                  className={`cursor-pointer transition-colors h-full ${
                    selectedCategoryId === category.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  }`}
                  onClick={() => handleSelectCategory(category.id)}
                >
                  <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6">
                    {Icon && <Icon className="h-5 w-5 sm:h-6 sm:w-6" />}
                    <h2 className="mt-2 font-semibold text-sm sm:text-base text-center">
                      {category.description}
                    </h2>
                  </CardContent>
                </Card>
              </ContextMenuTrigger>
              <ContextMenuContent className="min-w-[160px]">
                <ContextMenuItem onClick={() => openDeleteDialog(category)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('categories.delete')}
                </ContextMenuItem>
                <ContextMenuItem onClick={() => openEditDialog(category)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  {t('categories.edit')}
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
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('categories.alert.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('categories.alert.message')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:space-x-2">
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              {t('categories.alert.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCategory}>
              {t('categories.alert.continue')}
            </AlertDialogAction>
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
