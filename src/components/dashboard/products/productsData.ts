interface Product {
    id: string;
    name: string;
    status: "Active" | "Draft";
    price: number;
    quantityInStock: number;
    createdAt: string;
  }
  
  const initialProducts: Product[] = [
    { id: "1", name: "Laser Lemonade Machine", status: "Draft", price: 499.99, quantityInStock: 25, createdAt: "2023-07-12 10:42 AM" },
    { id: "2", name: "Hypernova Headphones", status: "Active", price: 129.99, quantityInStock: 100, createdAt: "2023-10-18 03:21 PM" },
    { id: "3", name: "AeroGlow Desk Lamp", status: "Active", price: 39.99, quantityInStock: 50, createdAt: "2023-11-29 08:15 AM" },
    { id: "4", name: "TechTonic Energy Drink", status: "Draft", price: 2.99, quantityInStock: 0, createdAt: "2023-12-25 11:59 PM" },
    { id: "5", name: "Gamer Gear Pro Controller", status: "Active", price: 59.99, quantityInStock: 75, createdAt: "2024-01-01 12:00 AM" },
    { id: "6", name: "Luminous VR Headset", status: "Active", price: 199.99, quantityInStock: 30, createdAt: "2024-02-14 02:14 PM" },
  ];

  export default initialProducts
  