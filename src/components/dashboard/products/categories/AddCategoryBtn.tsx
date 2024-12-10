import { FC, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useKeycloak } from "@react-keycloak/web";
import { useTranslation } from "react-i18next";

// Import types and icon map
import { AddCategoryBtnProps } from "./categories-types";
import iconMap from "./icons-map";
import { useToast } from "@/hooks/use-toast";

const categoryIcons = Object.keys(iconMap);

const AddCategoryBtn: FC<AddCategoryBtnProps> = ({ onAddCategory }) => {
  const [categoryName, setCategoryName] = useState<string>("");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { keycloak } = useKeycloak();
  const { t } = useTranslation('categoriesAndProducts');
  const { toast } = useToast();

  const handleCategoryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  };

  const handleIconSelect = (icon: string) => {
    setSelectedIcon(icon);
    setError(null);
  };

  const handleAddCategory = async () => {
    if (!selectedIcon) {
      setError("Please choose a category icon");
      return;
    }

    const newCategory = {
      description: categoryName,
      icon: selectedIcon,
    };

    try {
      const response = await fetch("https://api.invoicehub.space/category/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) throw new Error("Failed to add category");

      const createdCategory = await response.json();
      onAddCategory(createdCategory.data);
      setIsDialogOpen(false);
      setCategoryName("");
      setSelectedIcon(null);
      toast({
        title: t('products.success'),
        description: t('products.categoryMessage'),
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      setError("An error occurred while adding the category.");
      console.error(error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> {t('categories.addCategory.addCategory')}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto sm:w-[90vw] md:w-[80vw] lg:w-[60vw]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{t('categories.addCategory.addNewCategory')}</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {t('categories.addCategory.details')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Input
              type="text"
              placeholder={t('categories.addCategory.name')}
              value={categoryName}
              onChange={handleCategoryInput}
              className="w-full sm:flex-1"
            />
            <Button
              onClick={handleAddCategory}
              disabled={!categoryName || !selectedIcon}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('categories.addCategory.add')}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">{t('categories.addCategory.icon')}</h3>
          <Card>
            <CardContent className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 p-2">
              {categoryIcons.map((icon, index) => {
                const IconComponent = iconMap[icon];
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className={`p-2 hover:bg-secondary ${
                      selectedIcon === icon ? "bg-secondary" : ""
                    }`}
                    onClick={() => handleIconSelect(icon)}
                  >
                    {IconComponent && <IconComponent className="min-w-[20px] min-h-[20px]" />}
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryBtn;