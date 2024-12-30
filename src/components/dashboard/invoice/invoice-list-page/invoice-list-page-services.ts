import { API_BASE_URL } from "@/lib/utils/constants";
import { Invoice } from "../invoice-types";

// Fetch Invoices
export async function getInvoicesData(token: string): Promise<Invoice[]> {
  try {
    const response = await fetch(`${API_BASE_URL}invoice/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch invoices");
    }

    // Format the fetched data
    const formattedData: Invoice[] = result.data.map((invoice: any) => ({
      ...invoice,
      dateOfIssue: new Date(invoice.dateOfIssue),
      dueDate: new Date(invoice.dueDate),
    }));

    return formattedData;
  } catch (error: any) {
    throw new Error(error.message || "An unknown error occurred");
  }
}

// Delete Invoice
export async function deleteInvoice(
  token: string,
  invoiceId: number
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}invoice/delete/${invoiceId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let result;
    // If response is 204 (No Content), no JSON body is returned
    if (response.ok && response.status !== 204) {
      result = await response.json();
    }

    if (result?.success || response.status === 204) {
      return true; // Indicate success
    } else {
      throw new Error(result?.message || "Failed to delete invoice");
    }
  } catch (error: any) {
    throw new Error(
      error.message || "An unknown error occurred while deleting invoice"
    );
  }
}

// Approve Invoice
export async function approveInvoice(token: string, invoiceId: number) {
  try {
    const response = await fetch(
      `${API_BASE_URL}invoice/approve/${invoiceId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to approve invoice");
    }

    return true;
  } catch (error: any) {
    throw new Error(
      error.message || "An unknown error occurred while approving the invoice"
    );
  }
}

// Send Email
export async function sendInvoiceEmail(token: string, invoiceId: number) {
  try {
    const response = await fetch(
      `${API_BASE_URL}mailing/send-email/${invoiceId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to send invoice email");
    }

    return true;
  } catch (error: any) {
    throw new Error(
      error.message ||
        "An unknown error occurred while sending the invoice email"
    );
  }
}

export async function checkProductsData(token: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/product/list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    if (data.data.length === 0) {
      return true;
    } else {
      return false;
    }
  } catch (error: unknown) {
    throw new Error(
      "An unknown error occurred while sending the invoice email"
    );
  }
}

export async function checkClienData(token: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/product/list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    if (data.data.length === 0) {
      return true;
    } else {
      return false;
    }
  } catch (error: unknown) {
    throw new Error(
      "An unknown error occurred while sending the invoice email"
    );
  }
}
