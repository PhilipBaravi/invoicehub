// InvoicePDF.tsx
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer';
import testBusinessInfoData from './test-business-info-data';
import testCategoryListData from '../products/categories/test-category-list-data';

// Import the font files
import OpenSansRegular from '../../../fonts/OpenSans-Regular.ttf';
import OpenSansBold from '../../../fonts/OpenSans-Bold.ttf';

// Register the fonts
Font.register({
  family: 'Open Sans',
  fonts: [
    {
      src: OpenSansRegular,
    },
    {
      src: OpenSansBold,
      fontWeight: 'bold',
    },
  ],
});

interface LineItem {
  itemId: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  tax: number;
}

interface InvoicePDFProps {
  invoice: any;
  lineItems: LineItem[];
  selectedClient: any;
  logo: string | null;
  businessSignatureImage: string | null;
  clientSignatureImage: string | null;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Open Sans',
    fontSize: 12,
    padding: 40,
    backgroundColor: '#fafaf9', // bg-stone-50
    color: '#1a1a1a', // text-stone-900
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  invoiceDetails: {
    fontSize: 10,
    color: '#57534e', // text-stone-600
  },
  companyInfo: {
    textAlign: 'right',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  companyDetails: {
    fontSize: 10,
    color: '#57534e',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'semibold',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 10,
    color: '#57534e',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e5e5e5', // border-stone-300
    borderStyle: 'solid',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f4', // bg-gray-100
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    borderStyle: 'solid',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    borderStyle: 'solid',
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
  },
  tableCellHeader: {
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableCellRight: {
    textAlign: 'right',
  },
  totalsSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notesTerms: {
    width: '60%',
  },
  totalsContainer: {
    width: '35%',
    backgroundColor: '#f3f3f3', // Light grey background
    padding: 10,
    borderRadius: 5,
  },
  totals: {
    textAlign: 'right',
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalsLabel: {
    fontSize: 10,
  },
  totalsValue: {
    fontSize: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db', // Slightly darker grey
    marginVertical: 8,
  },
  signaturesSection: {
    marginTop: 30,
  },
  signaturesTitle: {
    fontSize: 14,
    fontWeight: 'semibold',
    marginBottom: 8,
  },
  signaturesContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBlock: {
    width: '48%',
    alignItems: 'center', // Center the signature within its block
  },
  signatureLabel: {
    fontSize: 10,
    marginBottom: 4,
  },
  signatureImage: {
    width: '65%', // Reduced width by 35%
    height: 39,   // Reduced height by 35% (from 60 to 39)
  },
  signatureLine: {
    width: '65%', // Match the reduced width
    height: 39,   // Match the reduced height
    borderBottomWidth: 1,
    borderBottomColor: '#d4d4d4',
    borderStyle: 'solid',
  },
});

const formatCurrency = (value: number) => {
  return `$${value.toFixed(2)}`;
};

const getCategoryName = (categoryId: number) => {
  const category = testCategoryListData.data.find((cat) => cat.id === categoryId);
  return category ? category.description : 'Unknown';
};

const InvoicePDF: React.FC<InvoicePDFProps> = ({
  invoice,
  lineItems,
  selectedClient,
  businessSignatureImage,
  clientSignatureImage,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>Invoice</Text>
          <View style={styles.invoiceDetails}>
            <Text>Invoice Number: {invoice.invoiceNo}</Text>
            <Text>
              Date of Issue: {new Date(invoice.dateOfIssue).toLocaleDateString()}
            </Text>
            <Text>
              Due Date: {new Date(invoice.dueDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{testBusinessInfoData.data.title}</Text>
          <Text style={styles.companyDetails}>{testBusinessInfoData.data.phone}</Text>
          <Text style={styles.companyDetails}>{testBusinessInfoData.data.website}</Text>
          <Text style={styles.companyDetails}>{testBusinessInfoData.data.address.country}</Text>
          <Text style={styles.companyDetails}>{testBusinessInfoData.data.address.city}</Text>
          <Text style={styles.companyDetails}>{testBusinessInfoData.data.address.addressLine1}</Text>
        </View>
      </View>

      {/* Bill To Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bill To:</Text>
        {selectedClient && (
          <View style={styles.sectionContent}>
            <Text>{selectedClient.name}</Text>
            <Text>{selectedClient.phone}</Text>
            <Text>{selectedClient.website}</Text>
            <Text>{selectedClient.email}</Text>
            <Text>{selectedClient.address.country}</Text>
            <Text>{selectedClient.address.city}</Text>
            <Text>{selectedClient.address.addressLine1}</Text>
          </View>
        )}
      </View>

      {/* Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCellHeader, { width: '15%' }]}>Category</Text>
          <Text style={[styles.tableCellHeader, { width: '20%' }]}>Product</Text>
          <Text style={[styles.tableCellHeader, { width: '15%' }]}>Price</Text>
          <Text style={[styles.tableCellHeader, { width: '10%' }]}>Quantity</Text>
          <Text style={[styles.tableCellHeader, { width: '15%' }]}>Tax</Text>
          <Text style={[styles.tableCellHeader, { width: '25%', textAlign: 'right' }]}>
            Line Total
          </Text>
        </View>
        {/* Table Rows */}
        {lineItems.map((item, index) => {
          const itemTax = (item.price * item.quantity * item.tax) / 100;
          const lineTotal = item.price * item.quantity + itemTax;
          return (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCell, { width: '15%' }]}>
                {getCategoryName(item.categoryId)}
              </Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>{item.name}</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>
                {formatCurrency(item.price)}
              </Text>
              <Text style={[styles.tableCell, { width: '10%' }]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>{item.tax}%</Text>
              <Text style={[styles.tableCell, { width: '25%', textAlign: 'right' }]}>
                {formatCurrency(lineTotal)}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Notes and Totals */}
      <View style={styles.totalsSection}>
        {/* Left Side: Notes and Terms */}
        <View style={styles.notesTerms}>
          {invoice.notes && (
            <>
              <Text style={styles.sectionTitle}>Notes:</Text>
              <Text style={styles.sectionContent}>{invoice.notes}</Text>
            </>
          )}
          {invoice.terms && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Terms:</Text>
              <Text style={styles.sectionContent}>{invoice.terms}</Text>
            </>
          )}
        </View>
        {/* Right Side: Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totals}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal:</Text>
              <Text style={styles.totalsValue}>{formatCurrency(invoice.price)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Tax:</Text>
              <Text style={styles.totalsValue}>{formatCurrency(invoice.tax)}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.totalsRow}>
              <Text style={[styles.totalsLabel, { fontWeight: 'bold' }]}>Total:</Text>
              <Text style={[styles.totalsValue, { fontWeight: 'bold' }]}>
                {formatCurrency(invoice.total)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Signatures */}
      <View style={styles.signaturesSection}>
        <Text style={styles.signaturesTitle}>Signatures:</Text>
        <View style={styles.signaturesContent}>
          {/* Business Signature */}
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>Business Signature:</Text>
            {businessSignatureImage ? (
              <Image
                src={businessSignatureImage}
                style={styles.signatureImage}
              />
            ) : (
              <View style={styles.signatureLine} />
            )}
          </View>
          {/* Client Signature */}
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>Client Signature:</Text>
            {clientSignatureImage ? (
              <Image
                src={clientSignatureImage}
                style={styles.signatureImage}
              />
            ) : (
              <View style={styles.signatureLine} />
            )}
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
