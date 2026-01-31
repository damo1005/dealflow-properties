import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
} from "@react-pdf/renderer";
import { DealPackData } from "@/stores/dealPackStore";
import { format } from "date-fns";

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
  },
  coverPage: {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: 40,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    opacity: 0.8,
  },
  coverContent: {
    marginTop: 100,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
  },
  headline: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 16,
  },
  address: {
    fontSize: 18,
    opacity: 0.9,
    marginBottom: 24,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 16,
  },
  metricBox: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 8,
  },
  metricLabel: {
    fontSize: 10,
    opacity: 0.8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  footer: {
    fontSize: 10,
    opacity: 0.6,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.6,
    color: "#374151",
    marginBottom: 12,
  },
  highlightItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  checkmark: {
    width: 16,
    height: 16,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: "white",
    fontSize: 10,
  },
  highlightText: {
    fontSize: 11,
    flex: 1,
  },
  snapshotContainer: {
    backgroundColor: "#f3f4f6",
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  snapshotTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
  },
  snapshotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  snapshotItem: {
    width: "45%",
  },
  snapshotLabel: {
    fontSize: 10,
    color: "#6b7280",
  },
  snapshotValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 4,
  },
  featuresList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  featureTag: {
    backgroundColor: "#eff6ff",
    color: "#3b82f6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
  },
  table: {
    marginTop: 16,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
  },
  tableLabel: {
    flex: 1,
    fontSize: 11,
    color: "#6b7280",
  },
  tableValue: {
    fontSize: 11,
    fontWeight: "bold",
  },
  returnsGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  returnBox: {
    flex: 1,
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  returnValue: {
    fontSize: 28,
    fontWeight: "bold",
  },
  returnLabel: {
    fontSize: 10,
    marginTop: 4,
  },
  contactFooter: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    alignItems: "center",
  },
  contactText: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 4,
  },
});

interface DealPackPDFProps {
  pack: DealPackData;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
};

function CoverPage({ pack }: DealPackPDFProps) {
  return (
    <Page size="A4" style={styles.coverPage}>
      <View style={styles.header}>
        <Text style={styles.companyName}>{pack.branding.companyName}</Text>
        <Text style={styles.date}>{format(new Date(), "MMMM yyyy")}</Text>
      </View>

      <View style={styles.coverContent}>
        <Text style={styles.subtitle}>Investment Opportunity</Text>
        <Text style={styles.headline}>{pack.headline || "Property Investment"}</Text>
        <Text style={styles.address}>{pack.property?.address}</Text>

        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Price</Text>
            <Text style={styles.metricValue}>{formatCurrency(pack.property?.price || 0)}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Yield</Text>
            <Text style={styles.metricValue}>{pack.property?.estimatedYield}%</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>ROI</Text>
            <Text style={styles.metricValue}>{pack.property?.roiPotential}%</Text>
          </View>
        </View>
      </View>

      <Text style={styles.footer}>{pack.branding.customFooter}</Text>
    </Page>
  );
}

function ExecutiveSummaryPage({ pack }: DealPackPDFProps) {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Executive Summary</Text>

      <Text style={styles.paragraph}>{pack.property?.description}</Text>

      <Text style={{ ...styles.snapshotTitle, marginTop: 20 }}>Investment Highlights</Text>
      {pack.investmentHighlights?.map((highlight, index) => (
        <View key={index} style={styles.highlightItem}>
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
          <Text style={styles.highlightText}>{highlight}</Text>
        </View>
      ))}

      <View style={styles.snapshotContainer}>
        <Text style={styles.snapshotTitle}>Financial Snapshot</Text>
        <View style={styles.snapshotGrid}>
          <View style={styles.snapshotItem}>
            <Text style={styles.snapshotLabel}>Purchase Price</Text>
            <Text style={styles.snapshotValue}>{formatCurrency(pack.financials?.purchasePrice || 0)}</Text>
          </View>
          <View style={styles.snapshotItem}>
            <Text style={styles.snapshotLabel}>Monthly Cashflow</Text>
            <Text style={{ ...styles.snapshotValue, color: "#059669" }}>
              {formatCurrency(pack.financials?.monthlyCashflow || 0)}
            </Text>
          </View>
          <View style={styles.snapshotItem}>
            <Text style={styles.snapshotLabel}>Annual Yield</Text>
            <Text style={styles.snapshotValue}>{pack.financials?.annualYield}%</Text>
          </View>
          <View style={styles.snapshotItem}>
            <Text style={styles.snapshotLabel}>ROI</Text>
            <Text style={styles.snapshotValue}>{pack.financials?.roi}%</Text>
          </View>
        </View>
      </View>

      {pack.recommendation && (
        <View style={{ marginTop: 20, paddingLeft: 12, borderLeftWidth: 3, borderLeftColor: "#3b82f6" }}>
          <Text style={{ ...styles.snapshotTitle, marginBottom: 8 }}>Recommendation</Text>
          <Text style={styles.paragraph}>{pack.recommendation}</Text>
        </View>
      )}
    </Page>
  );
}

function PropertyDetailsPage({ pack }: DealPackPDFProps) {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Property Details</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{pack.property?.bedrooms}</Text>
          <Text style={styles.statLabel}>Bedrooms</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{pack.property?.bathrooms}</Text>
          <Text style={styles.statLabel}>Bathrooms</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={{ ...styles.statValue, fontSize: 16 }}>{pack.property?.propertyType}</Text>
          <Text style={styles.statLabel}>Type</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={{ ...styles.statValue, fontSize: 16 }}>{formatCurrency(pack.property?.price || 0)}</Text>
          <Text style={styles.statLabel}>Price</Text>
        </View>
      </View>

      <Text style={{ ...styles.snapshotTitle, marginTop: 20 }}>Description</Text>
      <Text style={styles.paragraph}>{pack.property?.description}</Text>

      <Text style={{ ...styles.snapshotTitle, marginTop: 20 }}>Key Features</Text>
      <View style={styles.featuresList}>
        {pack.property?.features.map((feature, index) => (
          <Text key={index} style={styles.featureTag}>{feature}</Text>
        ))}
      </View>
    </Page>
  );
}

function FinancialAnalysisPage({ pack }: DealPackPDFProps) {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Financial Analysis</Text>

      <View style={{ flexDirection: "row", gap: 24 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.snapshotTitle}>Investment Structure</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Purchase Price</Text>
              <Text style={styles.tableValue}>{formatCurrency(pack.financials?.purchasePrice || 0)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Deposit (25%)</Text>
              <Text style={styles.tableValue}>{formatCurrency(pack.financials?.deposit || 0)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Mortgage Amount</Text>
              <Text style={styles.tableValue}>{formatCurrency(pack.financials?.mortgageAmount || 0)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Interest Rate</Text>
              <Text style={styles.tableValue}>{pack.financials?.interestRate}%</Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.snapshotTitle}>Monthly Cash Flow</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Monthly Rent</Text>
              <Text style={{ ...styles.tableValue, color: "#059669" }}>+{formatCurrency(pack.financials?.monthlyRent || 0)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Mortgage Payment</Text>
              <Text style={{ ...styles.tableValue, color: "#dc2626" }}>-{formatCurrency(pack.financials?.monthlyMortgage || 0)}</Text>
            </View>
            <View style={{ ...styles.tableRow, backgroundColor: "#f3f4f6" }}>
              <Text style={{ ...styles.tableLabel, fontWeight: "bold", color: "#111827" }}>Net Cashflow</Text>
              <Text style={{ ...styles.tableValue, color: "#059669" }}>{formatCurrency(pack.financials?.monthlyCashflow || 0)}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.returnsGrid}>
        <View style={{ ...styles.returnBox, backgroundColor: "#dcfce7" }}>
          <Text style={{ ...styles.returnValue, color: "#059669" }}>{pack.financials?.annualYield}%</Text>
          <Text style={{ ...styles.returnLabel, color: "#059669" }}>Gross Yield</Text>
        </View>
        <View style={{ ...styles.returnBox, backgroundColor: "#dbeafe" }}>
          <Text style={{ ...styles.returnValue, color: "#3b82f6" }}>{pack.financials?.roi}%</Text>
          <Text style={{ ...styles.returnLabel, color: "#3b82f6" }}>Cash on Cash ROI</Text>
        </View>
        <View style={{ ...styles.returnBox, backgroundColor: "#fef3c7" }}>
          <Text style={{ ...styles.returnValue, color: "#d97706", fontSize: 20 }}>{formatCurrency((pack.financials?.monthlyCashflow || 0) * 12)}</Text>
          <Text style={{ ...styles.returnLabel, color: "#d97706" }}>Annual Cashflow</Text>
        </View>
      </View>

      <View style={styles.contactFooter}>
        <Text style={styles.contactText}>{pack.branding.companyName}</Text>
        <Text style={styles.contactText}>{pack.branding.contactEmail} | {pack.branding.contactPhone}</Text>
        <Text style={styles.contactText}>{pack.branding.website}</Text>
      </View>
    </Page>
  );
}

export function DealPackPDF({ pack }: DealPackPDFProps) {
  const enabledSections = pack.sections
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <Document>
      {enabledSections.map((section) => {
        switch (section.type) {
          case "cover":
            return <CoverPage key={section.id} pack={pack} />;
          case "executive-summary":
            return <ExecutiveSummaryPage key={section.id} pack={pack} />;
          case "property-details":
            return <PropertyDetailsPage key={section.id} pack={pack} />;
          case "financial-analysis":
            return <FinancialAnalysisPage key={section.id} pack={pack} />;
          default:
            return null;
        }
      })}
    </Document>
  );
}

export async function generatePDF(pack: DealPackData): Promise<Blob> {
  const doc = <DealPackPDF pack={pack} />;
  const blob = await pdf(doc).toBlob();
  return blob;
}
