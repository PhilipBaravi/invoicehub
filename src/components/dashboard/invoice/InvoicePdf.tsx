// InvoicePdf.tsx

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
import { Category } from '../products/products-types';
import { BusinessInfo } from './invoice-types';

import OpenSansRegular from '../../../fonts/OpenSans-Regular.ttf';
import OpenSansBold from '../../../fonts/OpenSans-Bold.ttf';

Font.register({
  family: 'Open Sans',
  fonts: [
    { src: OpenSansRegular },
    { src: OpenSansBold, fontWeight: 'bold' },
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

interface ClientVendor {
  name: string;
  phone: string;
  website: string;
  email: string;
  address: {
    addressLine1: string;
    city: string;
    country: string;
  };
}

interface InvoicePDFProps {
  invoice: any;
  lineItems: LineItem[];
  selectedClient: ClientVendor | null;
  logo: string | null;
  businessSignatureImage: string | null;
  clientSignatureImage: string | null;
  businessInformation: BusinessInfo | null;
  categories: Category[];
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Open Sans',
    fontSize: 12,
    padding: 40,
    backgroundColor: '#fafaf9',
    color: '#1a1a1a',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  invoiceDetailsContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    fontSize: 10,
    color: '#57534e',
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  invoiceDetail: {
    marginBottom: 4,
  },
  infoSectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#4a4a4a',
  },
  sectionContent: {
    fontSize: 10,
    color: '#57534e',
    lineHeight: 1.3,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderStyle: 'solid',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f4',
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
    flex: 1,
    padding: 8,
    fontSize: 10,
  },
  tableCellRight: {
    textAlign: 'right',
  },
  totalsSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notesTermsContainer: {
    width: '60%',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 15,
  },
  notesItem: {
    marginBottom: 15,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    marginVertical: 10,
  },
  totalsContainer: {
    width: '35%',
    backgroundColor: '#f3f3f3',
    padding: 20,
    borderRadius: 5,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    alignItems: 'center',
  },
  totalItem: {
    marginBottom: 15,
    fontSize: 12,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  signaturesSection: {
    marginTop: 50,
  },
  signatureBlock: {
    width: '30%',
    alignItems: 'center',
  },
  signatureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  signatureLabel: {
    fontSize: 10,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#4a4a4a',
  },
  signatureImage: {
    width: '65%',
    height: 39,
    marginTop: 4,
  },
  signatureLine: {
    width: '65%',
    height: 39,
    borderBottomWidth: 1,
    borderBottomColor: '#d4d4d4',
    borderStyle: 'solid',
    marginTop: 4,
  },
});

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

const InvoicePDF: React.FC<InvoicePDFProps> = ({
  invoice,
  lineItems,
  selectedClient,
  logo,
  businessSignatureImage,
  clientSignatureImage,
  businessInformation,
  categories,
}) => {
  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.description : 'Unknown';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.invoiceDetailsContainer}>
            <Text style={styles.invoiceTitle}>Invoice</Text>
            <Text style={styles.invoiceDetail}>
              Invoice Number: {invoice.invoiceNo}
            </Text>
            <Text style={styles.invoiceDetail}>
              Date of Issue:{' '}
              {invoice.dateOfIssue
                ? new Date(invoice.dateOfIssue).toLocaleDateString()
                : 'N/A'}
            </Text>
            <Text style={styles.invoiceDetail}>
              Due Date:{' '}
              {invoice.dueDate
                ? new Date(invoice.dueDate).toLocaleDateString()
                : 'N/A'}
            </Text>
          </View>
          {logo && <Image src={logo} style={styles.logoContainer} />}
        </View>

        {/* Info Section */}
        <View style={styles.infoSectionContainer}>
          <View>
            <Text style={styles.sectionTitle}>Bill To:</Text>
            {selectedClient && (
              <View style={styles.sectionContent}>
                <Text>Company Name: {selectedClient.name}</Text>
                <Text>Phone: {selectedClient.phone}</Text>
                <Text>Website: {selectedClient.website}</Text>
                <Text>Email: {selectedClient.email}</Text>
                <Text>Country: {selectedClient.address.country}</Text>
                <Text>City: {selectedClient.address.city}</Text>
                <Text>Address: {selectedClient.address.addressLine1}</Text>
              </View>
            )}
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={styles.sectionTitle}>Business Information:</Text>
            {businessInformation ? (
              <View style={styles.sectionContent}>
                <Text>Company Name: {businessInformation.title}</Text>
                <Text>Phone: {businessInformation.phone}</Text>
                <Text>Website: {businessInformation.website}</Text>
                <Text>Email: {businessInformation.email}</Text>
                <Text>Country: {businessInformation.address.country}</Text>
                <Text>City: {businessInformation.address.city}</Text>
                <Text>Address: {businessInformation.address.addressLine1}</Text>
              </View>
            ) : (
              <Text>No business information available.</Text>
            )}
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Category</Text>
            <Text style={styles.tableCell}>Product</Text>
            <Text style={styles.tableCell}>Price</Text>
            <Text style={styles.tableCell}>Quantity</Text>
            <Text style={styles.tableCell}>Tax</Text>
            <Text style={[styles.tableCell, styles.tableCellRight]}>
              Line Total
            </Text>
          </View>
          {lineItems.map((item, index) => {
            const itemTax = (item.price * item.quantity * item.tax) / 100;
            const lineTotal = item.price * item.quantity + itemTax;
            return (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>
                  {getCategoryName(item.categoryId)}
                </Text>
                <Text style={styles.tableCell}>{item.name}</Text>
                <Text style={styles.tableCell}>
                  {formatCurrency(item.price)}
                </Text>
                <Text style={styles.tableCell}>{item.quantity}</Text>
                <Text style={styles.tableCell}>{item.tax}%</Text>
                <Text style={[styles.tableCell, styles.tableCellRight]}>
                  {formatCurrency(lineTotal)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Notes and Terms */}
        <View style={styles.totalsSection}>
          <View style={styles.notesTermsContainer}>
            {invoice.notes && (
              <View style={styles.notesItem}>
                <Text style={styles.sectionTitle}>Notes:</Text>
                <Text style={styles.sectionContent}>{invoice.notes}</Text>
              </View>
            )}
            {invoice.terms && (
              <View style={styles.notesItem}>
                <Text style={styles.sectionTitle}>Terms:</Text>
                <Text style={styles.sectionContent}>{invoice.terms}</Text>
              </View>
            )}
            {/* Optionally include Payment Terms */}
            {invoice.paymentTerms && (
              <View style={styles.notesItem}>
                <Text style={styles.sectionTitle}>Payment Terms:</Text>
                <Text style={styles.sectionContent}>{invoice.paymentTerms}</Text>
              </View>
            )}
          </View>
          <View style={styles.totalsContainer}>
            <View style={styles.totalItem}>
              <Text>Subtotal: {formatCurrency(invoice.price)}</Text>
            </View>
            <View style={styles.totalItem}>
              <Text>Tax: {formatCurrency(invoice.tax)}</Text>
            </View>
            <View style={styles.totalItem}>
              <Text style={{ fontWeight: 'bold' }}>
                Total: {formatCurrency(invoice.total)}
              </Text>
            </View>
          </View>
        </View>

        {/* Signatures */}
        <View style={styles.signaturesSection}>
          <Text style={styles.sectionTitle}>Signatures:</Text>
          <View style={styles.signatureContainer}>
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
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
