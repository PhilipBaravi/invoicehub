export type Address = {
    id: number;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  
  export type Company = {
    id: number;
    title: string;
    phone: string;
    website: string;
    address: Address;
  };
  
  export type CategoryList = {
    id: number;
    description: string;
    company: Company;
    icon: string; // This is coming from the backend as a string
    hasProduct: Boolean;
  };
  
  export type CategoryListData = {
    data: CategoryList[];
  };
  
  const testCategoryListData: CategoryListData = {
    "data": [
        {
            "id": 1,
            "description": "Accessories",
            "icon": "Airplay",
            "company": {
                "id": 1,
                "title": "red tech",
                "phone": "345",
                "website": "redtech@email.com",
                "address": {
                    "id": 1,
                    "addressLine1": "red street",
                    "addressLine2": "red avenue 23",
                    "city": "Tbilisi",
                    "state": "Tbilisi",
                    "country": "Georgia",
                    "zipCode": "0163"
                }
            },
            "hasProduct": false
        },
        {
            "id": 2,
            "description": "Cosmetics",
            "icon": "Leaf",
            "company": {
                "id": 1,
                "title": "red tech",
                "phone": "345",
                "website": "redtech@email.com",
                "address": {
                    "id": 1,
                    "addressLine1": "red street",
                    "addressLine2": "red avenue 23",
                    "city": "Tbilisi",
                    "state": "Tbilisi",
                    "country": "Georgia",
                    "zipCode": "0163"
                }
            },
            "hasProduct": false
        },
        {
            "id": 3,
            "description": "Beverages",
            "icon": "Book",
            "company": {
                "id": 1,
                "title": "red tech",
                "phone": "345",
                "website": "redtech@email.com",
                "address": {
                    "id": 1,
                    "addressLine1": "red street",
                    "addressLine2": "red avenue 23",
                    "city": "Tbilisi",
                    "state": "Tbilisi",
                    "country": "Georgia",
                    "zipCode": "0163"
                }
            },
            "hasProduct": false
        },
        {
            "id": 4,
            "description": "Books",
            "icon": "Utensils",
            "company": {
                "id": 1,
                "title": "red tech",
                "phone": "345",
                "website": "redtech@email.com",
                "address": {
                    "id": 1,
                    "addressLine1": "red street",
                    "addressLine2": "red avenue 23",
                    "city": "Tbilisi",
                    "state": "Tbilisi",
                    "country": "Georgia",
                    "zipCode": "0163"
                }
            },
            "hasProduct": false
        },
        {
            "id": 5,
            "description": "Dairy",
            "icon": "Car",
            "company": {
                "id": 1,
                "title": "red tech",
                "phone": "345",
                "website": "redtech@email.com",
                "address": {
                    "id": 1,
                    "addressLine1": "red street",
                    "addressLine2": "red avenue 23",
                    "city": "Tbilisi",
                    "state": "Tbilisi",
                    "country": "Georgia",
                    "zipCode": "0163"
                }
            },
            "hasProduct": false
        },
        {
            "id": 6,
            "description": "Electronics",
            "icon": "Laptop",
            "company": {
                "id": 1,
                "title": "red tech",
                "phone": "345",
                "website": "redtech@email.com",
                "address": {
                    "id": 1,
                    "addressLine1": "red street",
                    "addressLine2": "red avenue 23",
                    "city": "Tbilisi",
                    "state": "Tbilisi",
                    "country": "Georgia",
                    "zipCode": "0163"
                }
            },
            "hasProduct": false
        },
    ]
  };
  
  export default testCategoryListData;
  