interface Address {
    id: number;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  }
  
  interface BusinessInfo {
    id: number;
    title: string;
    phone: string;
    website: string;
    address: Address;
  }
  
  interface TestBusinessInfoData {
    data: BusinessInfo;
  }
  
  const testBusinessInfoData: TestBusinessInfoData = {
    data: {
      id: 1,
      title: "red tech",
      phone: "345",
      website: "redtech@email.com",
      address: {
        id: 1,
        addressLine1: "red street",
        addressLine2: "red avenue 23",
        city: "Tbilisi",
        state: "Tbilisi",
        country: "Georgia",
        zipCode: "0163"
      }
    }
  };

  export default testBusinessInfoData