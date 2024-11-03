// EditCategoryBtn.tsx

import { FC, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useKeycloak } from "@react-keycloak/web";

// Import types and icon map
import { EditCategoryBtnProps } from "./categories-types";
import iconMap from "./icons-map";

const categoryIcons = Object.keys(iconMap);

const EditCategoryBtn: FC<EditCategoryBtnProps> = ({ category, onEditCategory, isOpen, setIsOpen }) => {
  const [categoryName, setCategoryName] = useState<string>(category.description);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const { keycloak } = useKeycloak();

  useEffect(() => {
    const icon = categoryIcons.find((iconName) => iconName === category.icon);
    setSelectedIcon(icon || null);
  }, [category.icon]);

  const handleCategoryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  };

  const handleIconSelect = (icon: string) => {
    setSelectedIcon(icon);
  };

  const handleEditCategory = async () => {
    if (!selectedIcon) return;

    const updatedCategory = {
      ...category,
      description: categoryName,
      icon: selectedIcon,
    };

    try {
      const response = await fetch(`http://localhost:9090/api/v1/category/update/${category.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: JSON.stringify(updatedCategory),
      });

      if (!response.ok) throw new Error("Failed to update category");

      const result = await response.json();
      onEditCategory(result.data); // Use updated data returned from the API
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Modify the details for the category and choose an icon.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Category name"
              value={categoryName}
              onChange={handleCategoryInput}
            />
            <Button
              className="ml-2"
              onClick={handleEditCategory}
              disabled={!categoryName || !selectedIcon}
            >
              Save
            </Button>
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">Choose category icon:</h3>
          <Card>
            <CardContent className="grid grid-cols-4 gap-2 p-2">
              {categoryIcons.map((icon, index) => {
                const IconComponent = iconMap[icon];
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className={`p-2 hover:bg-secondary ${
                      selectedIcon === icon ? "bg-primary text-primary-foreground" : ""
                    }`}
                    onClick={() => handleIconSelect(icon)}
                  >
                    {IconComponent && <IconComponent className="h-6 w-6" />}
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

export default EditCategoryBtn;
