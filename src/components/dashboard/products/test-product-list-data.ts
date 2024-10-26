interface Category {
    id: number;
    description: string;
    icon: string;
  }
  
  interface Product {
    id: number;
    name: string;
    quantityInStock: number;
    lowLimitAlert: number;
    price: number;
    productUnit: string;
    createdAt: string;
    status: "Active" | "Draft";
    category: Category;
  }
  
  const testProductListData: { data: Product[] } = {
    data: [
      {
        id: 1,
        name: "Apple",
        quantityInStock: 20,
        lowLimitAlert: 5,
        price: 1.99,
        productUnit: "PCS",
        createdAt: "2024-01-05",
        status: "Active",
        category: {
          id: 1,
          description: "Accessories",
          icon: "ShoppingBag",
        },
      },
      {
        id: 2,
        name: "Peach",
        quantityInStock: 4,
        lowLimitAlert: 5,
        price: 2.99,
        productUnit: "PCS",
        createdAt: "2024-01-05",
        status: "Draft",
        category: {
          id: 2,
          description: "Cosmetics",
          icon: "Airplay",
        },
      },
      {
        id: 3,
        name: "Banana",
        quantityInStock: 10,
        lowLimitAlert: 3,
        price: 0.99,
        productUnit: "PCS",
        createdAt: "2024-02-01",
        status: "Active",
        category: {
          id: 3,
          description: "Beverages",
          icon: "Aperture",
        },
      },
      {
        id: 4,
        name: "Orange Juice",
        quantityInStock: 50,
        lowLimitAlert: 10,
        price: 3.49,
        productUnit: "Liters",
        createdAt: "2024-03-15",
        status: "Active",
        category: {
          id: 3,
          description: "Beverages",
          icon: "Aperture",
        },
      },
      {
        id: 5,
        name: "Shampoo",
        quantityInStock: 2,
        lowLimitAlert: 5,
        price: 5.99,
        productUnit: "Bottles",
        createdAt: "2024-01-20",
        status: "Draft",
        category: {
          id: 2,
          description: "Cosmetics",
          icon: "Airplay",
        },
      },
      {
        id: 6,
        name: "Chocolate Bar",
        quantityInStock: 15,
        lowLimitAlert: 5,
        price: 1.49,
        productUnit: "PCS",
        createdAt: "2024-01-15",
        status: "Active",
        category: {
          id: 5,
          description: "Dairy",
          icon: "Cake",
        },
      },
      {
        id: 7,
        name: "Laptop",
        quantityInStock: 5,
        lowLimitAlert: 2,
        price: 999.99,
        productUnit: "PCS",
        createdAt: "2024-04-01",
        status: "Active",
        category: {
          id: 6,
          description: "Electronics",
          icon: "Home",
        },
      },
      {
        id: 8,
        name: "Gaming Chair",
        quantityInStock: 3,
        lowLimitAlert: 2,
        price: 199.99,
        productUnit: "PCS",
        createdAt: "2024-05-10",
        status: "Active",
        category: {
          id: 7,
          description: "Services",
          icon: "Box",
        },
      },
      {
        id: 9,
        name: "Book",
        quantityInStock: 50,
        lowLimitAlert: 10,
        price: 19.99,
        productUnit: "PCS",
        createdAt: "2024-06-01",
        status: "Active",
        category: {
          id: 4,
          description: "Books",
          icon: "Book",
        },
      },
      {
        id: 10,
        name: "Sunglasses",
        quantityInStock: 0,
        lowLimitAlert: 5,
        price: 49.99,
        productUnit: "PCS",
        createdAt: "2024-07-12",
        status: "Draft",
        category: {
          id: 1,
          description: "Accessories",
          icon: "ShoppingBag",
        },
      },
    ],
  };
  
  export default testProductListData;
  