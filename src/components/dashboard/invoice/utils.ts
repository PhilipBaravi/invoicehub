import JSZip from "jszip"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export const downloadInvoice = async (invoiceElement: HTMLElement, attachments: File[]) => {
  const canvas = await html2canvas(invoiceElement)
  const imgData = canvas.toDataURL("image/png")
  const pdf = new jsPDF("p", "mm", "a4")
  const imgProps = pdf.getImageProperties(imgData)
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)

  const zip = new JSZip()
  zip.file("invoice.pdf", pdf.output("blob"))
  attachments.forEach((file) => {
    zip.file(file.name, file)
  })
  const content = await zip.generateAsync({ type: "blob" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(content)
  link.download = "invoice_with_attachments.zip"
  link.click()
}