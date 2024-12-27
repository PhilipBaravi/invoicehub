import { Product, ClientVendor, BusinessInfo, Invoice } from "./invoice-types";
import { API_BASE_URL } from "@/lib/utils/constants";

/**
 * Fetch client/vendor list
 */
export async function getClients(token: string): Promise<ClientVendor[]> {
  const response = await fetch(`${API_BASE_URL}clientVendor/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch clients.");
  }
  return data.data;
}

/**
 * Fetch logged-in company/business info
 */
export async function getLoggedInCompanyDetails(
  token: string
): Promise<BusinessInfo> {
  const response = await fetch(`${API_BASE_URL}user/loggedInUser`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch business information.");
  }
  return data.data.company;
}

/**
 * Fetch all products (raw data) from backend
 */
export async function getRawProducts(token: string): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}product/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch products.");
  }
  return data.data;
}

/**
 * Generate a new invoice number & date (for create)
 */
export async function generateInvoiceNumber(
  token: string
): Promise<{ invoiceNo: string; dateOfIssue: string }> {
  const response = await fetch(`${API_BASE_URL}invoice/generate`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to generate invoice number.");
  }
  return data.data; // { invoiceNo, dateOfIssue }
}

/**
 * Fetch the entire invoice list (used to locate a single invoice in edit mode)
 */
export async function getInvoiceList(token: string): Promise<Invoice[]> {
  const response = await fetch(`${API_BASE_URL}invoice/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch invoice list.");
  }
  return data.data;
}

/**
 * Fetch line items for a specific invoice
 */
export async function getLineItems(token: string, invoiceId: number) {
  const response = await fetch(
    `${API_BASE_URL}invoice/product/list/${invoiceId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch line items.");
  }
  return data.data;
}

/**
 * Remove an existing line item from the invoice
 */
export async function removeLineItem(token: string, lineItemId: number) {
  const response = await fetch(
    `${API_BASE_URL}invoice/remove/product/${lineItemId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // If status is 204 No Content, assume success
  if (response.status === 204) {
    return true;
  }

  // Attempt to parse JSON for other status codes
  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("Failed to parse response JSON.");
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to remove line item.");
  }

  return true;
}

/**
 * Create or Update an invoice
 */
export async function createOrUpdateInvoice(
  token: string,
  invoiceData: any,
  isEditMode: boolean,
  invoiceId?: number
): Promise<number> {
  const url = isEditMode
    ? `${API_BASE_URL}invoice/update/${invoiceId}`
    : `${API_BASE_URL}invoice/create`;

  const method = isEditMode ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(invoiceData),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to create/update invoice.");
  }

  return data.data.id;
}

/**
 * Add a product/line item to an invoice
 */
export async function addProductToInvoice(
  token: string,
  invoiceId: number,
  lineItemData: any
): Promise<boolean> {
  const response = await fetch(
    `${API_BASE_URL}invoice/add/product/${invoiceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(lineItemData),
    }
  );

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to add product to invoice.");
  }
  return true;
}
