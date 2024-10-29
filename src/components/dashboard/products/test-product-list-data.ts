interface Category {
    id: number;
    description: string;
    icon: string;
  }
  
  interface Product {
    id: number;
    name: string;
    description: string,
    quantityInStock: number;
    lowLimitAlert: number;
    price: number;
    productUnit: string;
    createdAt: string;
    status: "ACTIVE" | "DRAFT";
    category: Category;
  }
  
  const testProductListData: { data: Product[] } = {
    "data": [
        {
            "id": 1,
            "name": "Apple",
            "description": "Red",
            "quantityInStock": 20,
            "lowLimitAlert": 5,
            "price": 10.00,
            "createdAt": "2024-01-05",
            "productUnit": "PCS",
            "status": "ACTIVE",
            "category": {
                "id": 1,
                "description": "Accessories",
                "icon": "ShoppingBag"
            }
        },
        {
            "id": 2,
            "name": "Peach",
            "description": "Orange",
            "quantityInStock": 20,
            "lowLimitAlert": 5,
            "price": 7.00,
            "createdAt": "2024-01-05",
            "productUnit": "PCS",
            "status": "DRAFT",
            "category": {
                "id": 1,
                "description": "Accessories",
                "icon": "ShoppingBag"
            }
        },
        {
            "id": 3,
            "name": "Chocolate",
            "description": "Brown",
            "quantityInStock": 20,
            "lowLimitAlert": 5,
            "price": 8.00,
            "createdAt": "2024-01-05",
            "productUnit": "PCS",
            "status": "ACTIVE",
            "category": {
                "id": 1,
                "description": "Accessories",
                "icon": "ShoppingBag"
            }
        },
        {
            "id": 4,
            "name": "Ice-cream",
            "description": "White",
            "quantityInStock": 20,
            "lowLimitAlert": 5,
            "price": 9.00,
            "createdAt": "2024-01-05",
            "productUnit": "PCS",
            "status": "DRAFT",
            "category": {
                "id": 1,
                "description": "Accessories",
                "icon": "ShoppingBag"
            }
        }
    ]
  };
  
  export default testProductListData;
  