import {
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
    ShoppingBag,
    Utensils,
  } from "lucide-react";
  
  export type productCategoriesProps = {
    name: string;
    icon: React.ElementType;
    count: number;
  };
  
  export const productCategories: productCategoriesProps[] = [
    { name: "Accessories", icon: ShoppingBag, count: 5 },
    { name: "Airplanes", icon: Airplay, count: 3 },
    { name: "Beverages", icon: Coffee, count: 8 },
    { name: "Books", icon: Book, count: 12 },
    { name: "Canned Food", icon: Box, count: 7 },
    { name: "Confectionery", icon: Cake, count: 5 },
    { name: "Cosmetics", icon: Aperture, count: 9 },
    { name: "Dairy", icon: Droplet, count: 6 },
    { name: "Drinks", icon: Coffee, count: 4 },
    { name: "Electronics", icon: Laptop, count: 8 },
    { name: "House Hold", icon: Home, count: 15 },
    { name: "Meat", icon: Utensils, count: 5 },
    { name: "Sanitizers", icon: Droplet, count: 3 },
    { name: "Services", icon: Car, count: 4 },
    { name: "Spreads", icon: Leaf, count: 3 },
  ];
  