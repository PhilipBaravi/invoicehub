
  
  export type CategoryList = {
    id: number;
    description: string;
    icon: string; // This is coming from the backend as a string
  };
  
  export type CategoryListData = {
    data: CategoryList[];
  };
  
  const testCategoryListData: CategoryListData = {
    "data": [
        {
            "id": 1,
            "description": "Accessories",
            "icon": "ShoppingBag"
        },
        {
            "id": 2,
            "description": "Cosmetics",
            "icon": "Airplay"
        },
        {
            "id": 3,
            "description": "Beverages",
            "icon": "Aperture"
        },
        {
            "id": 4,
            "description": "Books",
            "icon": "Book"
        },
        {
            "id": 5,
            "description": "Dairy",
            "icon": "Cake"
        },
        {
            "id": 6,
            "description": "Electronics",
            "icon": "Home"
        },
        {
            "id": 7,
            "description": "Services",
            "icon": "Box"
        }
    ]
    
  };
  
  export default testCategoryListData;
  