type InvoiceStatus = "AWAITING_APPROVAL" | "APPROVED";

type InvoiceType = "SALES" | "PURCHASE";

type ClientVendorType = "CLIENT" | "VENDOR";

type ProductStatus = "ACTIVE" | "DRAFT";

interface Address {
    id: number;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}

interface ClientVendor {
    id: number;
    name: string;
    phone: string;
    website: string;
    email: string;
    clientVendorType: ClientVendorType;
    address: Address;
}

interface Invoice {
    id: number;
    invoiceNo: string;
    invoiceStatus: InvoiceStatus;
    invoiceType: InvoiceType;
    dateOfIssue: string; // Consider using Date if dates are to be manipulated
    dueDate: string;     // Consider using Date if dates are to be manipulated
    paymentTerms: string;
    notes: string;
    clientVendor: ClientVendor;
    price: number;
    tax: number;
    total: number;
}

interface Category {
    id: number;
    description: string;
    icon: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    quantityInStock: number;
    lowLimitAlert: number;
    price: number;
    createdAt: string; // Consider using Date if dates are to be manipulated
    productUnit: string; // ProductUnit is a string
    status: ProductStatus;
    category: Category;
}

interface InvoiceProduct {
    id: number;
    quantity: number;
    price: number;
    tax: number;
    total: number;
    profitLoss: number;
    remainingQuantity: number;
    invoice: Invoice;
    product: Product;
}

interface InvoiceProductListData {
    data: InvoiceProduct[];
}

const testInvoiceProductListData: InvoiceProductListData = {
    data: [
        {
            id: 1,
            quantity: 2,
            price: 20.0,
            tax: 10.0,
            total: 44.0,
            profitLoss: 0.0,
            remainingQuantity: 20,
            invoice: {
                id: 1,
                invoiceNo: "INV001",
                invoiceStatus: "AWAITING_APPROVAL",
                invoiceType: "SALES",
                dateOfIssue: "2024-10-23T00:00:00",
                dueDate: "2024-11-23T00:00:00",
                paymentTerms: "terms",
                notes: "notes",
                clientVendor: {
                    id: 1,
                    name: "Samsung",
                    phone: "0123456789",
                    website: "samsung.com",
                    email: "samsung@email.com",
                    clientVendorType: "CLIENT",
                    address: {
                        id: 4,
                        addressLine1: "purple street",
                        addressLine2: "purple avenue 25",
                        city: "Tbilisi",
                        state: "Tbilisi",
                        country: "Georgia",
                        zipCode: "0166",
                    },
                },
                price: 20.0,
                tax: 10.0,
                total: 0.0,
            },
            product: {
                id: 1,
                name: "Apple",
                description: "Red",
                quantityInStock: 20,
                lowLimitAlert: 5,
                price: 10.0,
                createdAt: "2024-01-05",
                productUnit: "PCS", // ProductUnit is a string
                status: "ACTIVE",
                category: {
                    id: 1,
                    description: "Accessories",
                    icon: "ShoppingBag",
                },
            },
        },
        {
            id: 2,
            quantity: 5,
            price: 25.0,
            tax: 10.0,
            total: 137.5,
            profitLoss: 0.0,
            remainingQuantity: 0,
            invoice: {
                id: 1,
                invoiceNo: "INV001",
                invoiceStatus: "AWAITING_APPROVAL",
                invoiceType: "SALES",
                dateOfIssue: "2024-10-23T00:00:00",
                dueDate: "2024-11-23T00:00:00",
                paymentTerms: "terms",
                notes: "notes",
                clientVendor: {
                    id: 1,
                    name: "Samsung",
                    phone: "0123456789",
                    website: "samsung.com",
                    email: "samsung@email.com",
                    clientVendorType: "CLIENT",
                    address: {
                        id: 4,
                        addressLine1: "purple street",
                        addressLine2: "purple avenue 25",
                        city: "Tbilisi",
                        state: "Tbilisi",
                        country: "Georgia",
                        zipCode: "0166",
                    },
                },
                price: 25.0,
                tax: 10.0,
                total: 0.0,
            },
            product: {
                id: 2,
                name: "Peach",
                description: "Orange",
                quantityInStock: 20,
                lowLimitAlert: 5,
                price: 7.0,
                createdAt: "2024-01-05",
                productUnit: "PCS",
                status: "DRAFT",
                category: {
                    id: 1,
                    description: "Accessories",
                    icon: "ShoppingBag",
                },
            },
        },
        {
            id: 3,
            quantity: 2,
            price: 300.0,
            tax: 10.0,
            total: 660.0,
            profitLoss: 0.0,
            remainingQuantity: 0,
            invoice: {
                id: 1,
                invoiceNo: "INV001",
                invoiceStatus: "AWAITING_APPROVAL",
                invoiceType: "SALES",
                dateOfIssue: "2024-10-23T00:00:00",
                dueDate: "2024-11-23T00:00:00",
                paymentTerms: "terms",
                notes: "notes",
                clientVendor: {
                    id: 1,
                    name: "Samsung",
                    phone: "0123456789",
                    website: "samsung.com",
                    email: "samsung@email.com",
                    clientVendorType: "CLIENT",
                    address: {
                        id: 4,
                        addressLine1: "purple street",
                        addressLine2: "purple avenue 25",
                        city: "Tbilisi",
                        state: "Tbilisi",
                        country: "Georgia",
                        zipCode: "0166",
                    },
                },
                price: 300.0,
                tax: 10.0,
                total: 0.0,
            },
            product: {
                id: 3,
                name: "Chocolate",
                description: "Brown",
                quantityInStock: 20,
                lowLimitAlert: 5,
                price: 8.0,
                createdAt: "2024-01-05",
                productUnit: "PCS",
                status: "ACTIVE",
                category: {
                    id: 1,
                    description: "Accessories",
                    icon: "ShoppingBag",
                },
            },
        },
    ],
};

export default testInvoiceProductListData;
