export interface address {
    id: number,
    addressLine1: string,
    addressLine2: string,
    city: string,
    state: string,
    country: string,
    zipCode: string
}

export interface clientVendor {
    id: number,
    name: string,
    phone: string,
    website: string,
    email: string,
    clientVendorType: "CLIENT" | 'Vendor';
}

export interface invoiceData {
    id: number, // Get From Generate
    invoiceNo: string, // Get From Generate
    invoiceStatus: "PENDING" | 'APPROVED',
    dateOfIssue: Date, // Get From generate
    dueDate: Date,
    clientVendor: clientVendor,
    address: address,
    price: number,
    tax: number,
    total: number
}

export interface invoiceDataProps {
    data: invoiceData[]
}

const testInvoiceListData = {
    "data": [
        {
            "id": 1,
            "invoiceNo": "INV001",
            "invoiceStatus": "PENDING",
            "invoiceType": "SALES",
            "dateOfIssue": "2024-10-23T00:00:00",
            "dueDate": "2024-11-23T00:00:00",
            "clientVendor": {
                "id": 1,
                "name": "Samsung",
                "phone": "0123456789",
                "website": "samsung.com",
                "email": "samsung@email.com",
                "clientVendorType": "CLIENT",
                "address": {
                    "id": 4,
                    "addressLine1": "purple street",
                    "addressLine2": "purple avenue 25",
                    "city": "Tbilisi",
                    "state": "Tbilisi",
                    "country": "Georgia",
                    "zipCode": "0166"
                }
            },
            "price": 5000.00,
            "tax": 500.00,
            "total": 5500.00
        },
        {
            "id": 2,
            "invoiceNo": "INV002",
            "invoiceStatus": "APPROVED",
            "invoiceType": "PURCHASE",
            "dateOfIssue": "2024-10-23T00:00:00",
            "dueDate": "2024-07-23T00:00:00",
            "clientVendor": {
                "id": 1,
                "name": "Samsung",
                "phone": "0123456789",
                "website": "samsung.com",
                "email": "samsung@email.com",
                "clientVendorType": "CLIENT",
                "address": {
                    "id": 4,
                    "addressLine1": "purple street",
                    "addressLine2": "purple avenue 25",
                    "city": "Tbilisi",
                    "state": "Tbilisi",
                    "country": "Georgia",
                    "zipCode": "0166"
                }
            },
            "price": 0,
            "tax": 0,
            "total": 0
        },
        {
            "id": 3,
            "invoiceNo": "INV003",
            "invoiceStatus": "APPROVED",
            "invoiceType": "SALES",
            "dateOfIssue": "2024-10-23T00:00:00",
            "dueDate": "2024-09-12T00:00:00",
            "clientVendor": {
                "id": 1,
                "name": "Samsung",
                "phone": "0123456789",
                "website": "samsung.com",
                "email": "samsung@email.com",
                "clientVendorType": "CLIENT",
                "address": {
                    "id": 4,
                    "addressLine1": "purple street",
                    "addressLine2": "purple avenue 25",
                    "city": "Tbilisi",
                    "state": "Tbilisi",
                    "country": "Georgia",
                    "zipCode": "0166"
                }
            },
            "price": 0,
            "tax": 0,
            "total": 0
        },
        {
            "id": 4,
            "invoiceNo": "INV004",
            "invoiceStatus": "AWAITING_APPROVAL",
            "invoiceType": "PURCHASE",
            "dateOfIssue": "2024-10-23T00:00:00",
            "dueDate": "2024-11-14T00:00:00",
            "clientVendor": {
                "id": 1,
                "name": "Samsung",
                "phone": "0123456789",
                "website": "samsung.com",
                "email": "samsung@email.com",
                "clientVendorType": "CLIENT",
                "address": {
                    "id": 4,
                    "addressLine1": "purple street",
                    "addressLine2": "purple avenue 25",
                    "city": "Tbilisi",
                    "state": "Tbilisi",
                    "country": "Georgia",
                    "zipCode": "0166"
                }
            },
            "price": 0,
            "tax": 0,
            "total": 0
        },
        {
            "id": 5,
            "invoiceNo": "INV005",
            "invoiceStatus": "APPROVED",
            "invoiceType": "SALES",
            "dateOfIssue": "2024-10-23T00:00:00",
            "dueDate": "2024-12-23T00:00:00",
            "clientVendor": {
                "id": 1,
                "name": "Samsung",
                "phone": "0123456789",
                "website": "samsung.com",
                "email": "samsung@email.com",
                "clientVendorType": "CLIENT",
                "address": {
                    "id": 4,
                    "addressLine1": "purple street",
                    "addressLine2": "purple avenue 25",
                    "city": "Tbilisi",
                    "state": "Tbilisi",
                    "country": "Georgia",
                    "zipCode": "0166"
                }
            },
            "price": 0,
            "tax": 0,
            "total": 0
        }
    ]
}

export default testInvoiceListData;