export interface LineItem {
    itemId: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    tax: number;
  }
  
  export interface PredefinedItem {
    id: string;
    name: string;
    description: string;
    price: number;
  }
  
  export const predefinedItems: PredefinedItem[] = [
    { id: 'item1', name: 'Web Design', description: 'Custom website design services', price: 1000 },
    { id: 'item2', name: 'SEO Package', description: 'Search engine optimization services', price: 500 },
    { id: 'item3', name: 'Content Writing', description: 'Professional content writing (per 1000 words)', price: 100 },
  ];
  