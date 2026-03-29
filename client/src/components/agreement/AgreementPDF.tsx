'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Using standard Helvetica for perfect reliability and a clean, modern look
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#334155', // slate-700
    lineHeight: 1.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0', // slate-200
    paddingBottom: 20,
    marginBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    textAlign: 'right',
  },
  brandName: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a', // slate-900
    letterSpacing: -0.5,
  },
  documentType: {
    fontSize: 10,
    color: '#64748b', // slate-500
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    backgroundColor: '#f8fafc', // slate-50
    padding: '6 10',
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#f43f5e', // rose-500 accent
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9', // slate-100
    paddingBottom: 6,
  },
  label: {
    width: 140,
    fontFamily: 'Helvetica-Bold',
    color: '#475569', // slate-600
  },
  value: {
    flex: 1,
    color: '#0f172a',
  },
  termsText: {
    fontSize: 10,
    color: '#334155',
    textAlign: 'justify',
  },
  signatureSection: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '40%',
  },
  signatureLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#0f172a',
    marginBottom: 40, // Space for signature
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#94a3b8', // slate-400
    marginBottom: 8,
  },
  signatureSubText: {
    fontSize: 9,
    color: '#64748b',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#94a3b8',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
});

interface AgreementPDFProps {
  data: {
    propertyTitle: string;
    tenantName: string;
    monthlyRent: number;
    securityDeposit: number;
    startDate: string;
    endDate: string;
    terms: string;
    specialConditions?: string;
  };
}

export function AgreementPDF({ data }: AgreementPDFProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Modern Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.brandName}>UrbanKey</Text>
            <Text style={styles.documentType}>Rental Agreement</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={{ color: '#64748b' }}>Generated on:</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold', color: '#0f172a' }}>{today}</Text>
          </View>
        </View>

        {/* Parties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Parties to the Agreement</Text>
          <Text style={{ marginBottom: 12 }}>This Rental Agreement is made and entered into on {today} by and between:</Text>
          <View>
            <View style={styles.row}>
              <Text style={styles.label}>Landlord:</Text>
              <Text style={styles.value}>The verified owner of the property listed below</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Tenant:</Text>
              <Text style={styles.value}>{data.tenantName}</Text>
            </View>
          </View>
        </View>

        {/* Property & Term */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Property & Lease Term</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Property Address:</Text>
            <Text style={styles.value}>{data.propertyTitle}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Lease Start Date:</Text>
            <Text style={styles.value}>{formatDate(data.startDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Lease End Date:</Text>
            <Text style={styles.value}>{formatDate(data.endDate)}</Text>
          </View>
        </View>

        {/* Financials */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Financial Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Monthly Rent:</Text>
            <Text style={styles.value}>₹{formatCurrency(data.monthlyRent)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Security Deposit:</Text>
            <Text style={styles.value}>₹{formatCurrency(data.securityDeposit)}</Text>
          </View>
          <Text style={{ marginTop: 8, color: '#64748b', fontSize: 9 }}>
            * Rent is due on or before the 5th day of each month. The security deposit is refundable at the end of the lease term, subject to deductions for damages beyond normal wear and tear.
          </Text>
        </View>

        {/* Terms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Standard Terms & Conditions</Text>
          <Text style={styles.termsText}>{data.terms}</Text>
        </View>

        {/* Special Conditions */}
        {data.specialConditions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Special Conditions</Text>
            <Text style={styles.termsText}>{data.specialConditions}</Text>
          </View>
        )}

        {/* Formal Signature Block */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>LANDLORD</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureSubText}>Authorized Signature</Text>
            <Text style={[styles.signatureSubText, { marginTop: 4 }]}>Date: ____________________</Text>
          </View>
          
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>TENANT</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureSubText}>{data.tenantName}</Text>
            <Text style={[styles.signatureSubText, { marginTop: 4 }]}>Date: ____________________</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>This agreement was securely generated via UrbanKey. Both parties are advised to read all terms carefully.</Text>
          <Text>© {new Date().getFullYear()} UrbanKey Platform - Document ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</Text>
        </View>
      </Page>
    </Document>
  );
}