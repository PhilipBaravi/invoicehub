import { FC, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import JSZip from "jszip";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ExportInvoice: FC = () => {
  const invoiceRef = useRef<HTMLDivElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const hideElements = (shouldHide: boolean) => {
    const billedToSelect = document.querySelector("#client");
    const invoiceNumberInput = document.querySelector("#invoiceNumber");
    const addItemButton = document.querySelector("#addItemButton");

    if (billedToSelect) (billedToSelect as HTMLElement).style.display = shouldHide ? "none" : "block";
    if (invoiceNumberInput) (invoiceNumberInput as HTMLElement).style.display = shouldHide ? "none" : "block";
    if (addItemButton) (addItemButton as HTMLElement).style.display = shouldHide ? "none" : "inline-flex";
  };

  const exportAsPdf = async () => {
    setIsExporting(true);
    // Hide the interactive elements before exporting
    hideElements(true);

    const invoiceElement = invoiceRef.current;
    if (!invoiceElement) return;

    try {
      // Generate canvas from the invoice HTML
      const canvas = await html2canvas(invoiceElement);
      const imgData = canvas.toDataURL("image/png");

      // Create PDF from the canvas
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      // Add image to PDF
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

      // Save the PDF directly or add it to a zip
      pdf.save("invoice.pdf");
    } catch (error) {
      console.error("Error exporting invoice as PDF:", error);
    } finally {
      // Show the hidden elements again
      hideElements(false);
      setIsExporting(false);
    }
  };

  const exportAsZip = async () => {
    setIsExporting(true);
    hideElements(true);

    const invoiceElement = invoiceRef.current;
    if (!invoiceElement) return;

    try {
      const zip = new JSZip();
      const canvas = await html2canvas(invoiceElement);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      const pdfBlob = pdf.output("blob");

      // Add PDF to the zip file
      zip.file("invoice.pdf", pdfBlob);

      // If you have any attachment files, add them to the zip as well
      // Example:
      // const attachmentBlob = await fetchAttachment(); // Implement fetching of the attachment
      // zip.file("attachment.png", attachmentBlob);

      const content = await zip.generateAsync({ type: "blob" });
      const zipBlobURL = URL.createObjectURL(content);

      const link = document.createElement("a");
      link.href = zipBlobURL;
      link.download = "invoice_with_attachments.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting invoice and attachments as ZIP:", error);
    } finally {
      hideElements(false);
      setIsExporting(false);
    }
  };

  return (
    <div>
      {/* Invoice Content */}
      <div ref={invoiceRef} id="invoiceContent">
        <CardContent className="space-y-4">
          {/* Invoice content like InvoiceHeader, LineItems, etc. */}
        </CardContent>
      </div>

      {/* Export Buttons */}
      <div className="mt-4">
        <Button onClick={exportAsPdf} disabled={isExporting}>
          Export as PDF
        </Button>
        <Button onClick={exportAsZip} disabled={isExporting} className="ml-2">
          Export as ZIP
        </Button>
      </div>
    </div>
  );
};

export default ExportInvoice;
