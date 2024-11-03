import { LucideIcon } from "lucide-react";

export interface Category {
  id: number;
  description: string;
  icon: string;
}

export interface AddCategoryBtnProps {
  onAddCategory: (newCategory: Category) => void;
}

export interface EditCategoryBtnProps {
  category: Category;
  onEditCategory: (updatedCategory: Category) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export type IconMap = Record<string, LucideIcon>;
