import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 375;

/* 🌿 AROGYADATHA DIAGNOSTICS REPORT THEME */
const COLORS = {
  bg: "#F8FAFC",
  bgLight: "#FFFFFF",
  card: "#FFFFFF",
  primary: "#10B981",
  primaryLight: "#34D399",
  primaryDark: "#065F46",
  soft: "#ECFDF5",
  softLight: "#F0FDFA",
  warning: "#F59E0B",
  info: "#3B82F6",
  infoLight: "#60A5FA",
  success: "#10B981",
  successLight: "#34D399",
  danger: "#EF4444",
  muted: "#64748B",
  mutedLight: "#94A3B8",
  text: "#0F172A",
  textLight: "#334155",
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  abnormal: "#EF4444",
  normal: "#10B981",
  critical: "#DC2626",
  overlay: "rgba(6, 95, 70, 0.9)",
};

/* 📊 REPORT STATUS & TYPES */
const REPORT_STATUS = {
  draft: { label: "Draft", color: COLORS.muted, bg: "#F1F5F9", icon: "create-outline" },
  pending_review: { label: "Pending Review", color: COLORS.warning, bg: "#FEF3C7", icon: "time-outline" },
  approved: { label: "Approved", color: COLORS.success, bg: "#D1FAE5", icon: "checkmark-circle-outline" },
  published: { label: "Published", color: COLORS.info, bg: "#DBEAFE", icon: "paper-plane-outline" },
  amended: { label: "Amended", color: COLORS.warning, bg: "#FEF3C7", icon: "refresh-outline" },
};

const REPORT_TYPE = {
  normal: { label: "Normal", color: COLORS.normal, bg: "#D1FAE5", icon: "checkmark-circle" },
  abnormal: { label: "Abnormal", color: COLORS.abnormal, bg: "#FEE2E2", icon: "alert-circle" },
  critical: { label: "Critical", color: COLORS.critical, bg: "#FEE2E2", icon: "warning" },
};

/* 📋 SAMPLE REPORTS DATA */
const REPORTS = [
  {
    id: "REP-2024-001",
    patient: "John Carter",
    patientId: "PAT-2024-001",
    age: 45,
    gender: "Male",
    test: "Complete Blood Count",
    lab: "Hematology",
    doctor: "Dr. Sharma",
    date: "2024-01-15",
    time: "10:30 AM",
    status: "published",
    type: "normal",
    results: [
      { parameter: "Hemoglobin", value: "14.2 g/dL", normalRange: "13.5-17.5", flag: "normal" },
      { parameter: "WBC Count", value: "7.8 x10³/μL", normalRange: "4.0-11.0", flag: "normal" },
      { parameter: "Platelets", value: "250 x10³/μL", normalRange: "150-450", flag: "normal" },
    ],
    remarks: "All parameters within normal limits.",
    reviewedBy: "Dr. Patel",
    pdfUrl: "https://example.com/reports/REP-2024-001.pdf",
  },
  {
    id: "REP-2024-002",
    patient: "Emily Johnson",
    patientId: "PAT-2024-002",
    age: 32,
    gender: "Female",
    test: "Lipid Profile",
    lab: "Biochemistry",
    doctor: "Dr. Gupta",
    date: "2024-01-15",
    time: "11:45 AM",
    status: "approved",
    type: "abnormal",
    results: [
      { parameter: "Total Cholesterol", value: "240 mg/dL", normalRange: "<200", flag: "high" },
      { parameter: "LDL Cholesterol", value: "160 mg/dL", normalRange: "<100", flag: "high" },
      { parameter: "HDL Cholesterol", value: "38 mg/dL", normalRange: ">40", flag: "low" },
      { parameter: "Triglycerides", value: "210 mg/dL", normalRange: "<150", flag: "high" },
    ],
    remarks: "Elevated lipid levels suggest hyperlipidemia. Recommend lifestyle modifications.",
    reviewedBy: "Dr. Singh",
    pdfUrl: "",
  },
  {
    id: "REP-2024-003",
    patient: "Robert Chen",
    patientId: "PAT-2024-003",
    age: 58,
    gender: "Male",
    test: "Troponin I + ECG",
    lab: "Cardiology",
    doctor: "Dr. Patel",
    date: "2024-01-15",
    time: "09:15 AM",
    status: "published",
    type: "critical",
    results: [
      { parameter: "Troponin I", value: "4.2 ng/mL", normalRange: "<0.04", flag: "critical" },
      { parameter: "CK-MB", value: "45 U/L", normalRange: "0-25", flag: "high" },
    ],
    remarks: "CRITICAL VALUE: Highly elevated Troponin I suggestive of myocardial infarction. Notify physician immediately.",
    reviewedBy: "Dr. Sharma",
    pdfUrl: "https://example.com/reports/REP-2024-003.pdf",
  },
  {
    id: "REP-2024-004",
    patient: "Sarah Williams",
    patientId: "PAT-2024-004",
    age: 29,
    gender: "Female",
    test: "Thyroid Profile",
    lab: "Endocrinology",
    doctor: "Dr. Singh",
    date: "2024-01-14",
    time: "Yesterday",
    status: "draft",
    type: "abnormal",
    results: [
      { parameter: "TSH", value: "0.1 μIU/mL", normalRange: "0.4-4.0", flag: "low" },
      { parameter: "Free T4", value: "2.8 ng/dL", normalRange: "0.8-1.8", flag: "high" },
    ],
    remarks: "Pattern suggests hyperthyroidism. Pending review by endocrinologist.",
    reviewedBy: "",
    pdfUrl: "",
  },
  {
    id: "REP-2024-005",
    patient: "Michael Brown",
    patientId: "PAT-2024-005",
    age: 65,
    gender: "Male",
    test: "Urine Culture",
    lab: "Microbiology",
    doctor: "Dr. Kumar",
    date: "2024-01-14",
    time: "Yesterday",
    status: "pending_review",
    type: "abnormal",
    results: [
      { parameter: "Culture Result", value: "E. coli >100,000 CFU/mL", normalRange: "No growth", flag: "abnormal" },
      { parameter: "Sensitivity", value: "Sensitive to Ciprofloxacin", normalRange: "N/A", flag: "" },
    ],
    remarks: "Significant bacteriuria detected. Antibiotic sensitivity report attached.",
    reviewedBy: "",
    pdfUrl: "",
  },
  {
    id: "REP-2024-006",
    patient: "Lisa Garcia",
    patientId: "PAT-2024-006",
    age: 41,
    gender: "Female",
    test: "HbA1c + Blood Glucose",
    lab: "Biochemistry",
    doctor: "Dr. Rao",
    date: "2024-01-15",
    time: "08:30 AM",
    status: "published",
    type: "normal",
    results: [
      { parameter: "HbA1c", value: "5.6%", normalRange: "<5.7", flag: "normal" },
      { parameter: "Fasting Glucose", value: "92 mg/dL", normalRange: "70-100", flag: "normal" },
    ],
    remarks: "Normal glycemic control. No evidence of diabetes.",
    reviewedBy: "Dr. Gupta",
    pdfUrl: "https://example.com/reports/REP-2024-006.pdf",
  },
];

export default function DiagnosticsReports() {
  const [filter, setFilter] = useState<"all" | "draft" | "pending_review" | "approved" | "published" | "amended">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "normal" | "abnormal" | "critical">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const filteredReports = useMemo(() => {
    return REPORTS.filter((report) => {
      const matchesStatus = filter === "all" || report.status === filter;
      const matchesType = typeFilter === "all" || report.type === typeFilter;
      const matchesSearch = searchQuery === "" || 
        report.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.test.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.patientId.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Date filter logic
      const matchesDate = !dateRange.start || !dateRange.end || 
        (report.date >= dateRange.start && report.date <= dateRange.end);
      
      return matchesStatus && matchesType && matchesSearch && matchesDate;
    });
  }, [filter, typeFilter, searchQuery, dateRange]);

  const stats = useMemo(() => {
    const counts: any = {
      total: REPORTS.length,
      draft: 0,
      pending_review: 0,
      approved: 0,
      published: 0,
      amended: 0,
      normal: 0,
      abnormal: 0,
      critical: 0,
      today: REPORTS.filter(r => r.date === "2024-01-15").length,
    };
    
    REPORTS.forEach(report => {
      counts[report.status]++;
      counts[report.type]++;
    });
    
    return counts;
  }, []);

  const handleShareReport = async (report: any) => {
    if (!report.pdfUrl) {
      Alert.alert("No PDF Available", "This report hasn't been generated as PDF yet.");
      return;
    }
    
    try {
      // In real app, you would use Share.share() with the PDF file
      Alert.alert("Share Report", `Share report ${report.id} with doctor/patient?`, [
        { text: "Cancel", style: "cancel" },
        { text: "Email", onPress: () => console.log("Email share") },
        { text: "WhatsApp", onPress: () => console.log("WhatsApp share") },
        { text: "Print", onPress: () => console.log("Print report") },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to share report");
    }
  };

  const handleGeneratePDF = (report: any) => {
    Alert.alert("Generate PDF", `Generate PDF for report ${report.id}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Generate", onPress: () => {
        console.log("Generating PDF for:", report.id);
        // PDF generation logic here
      }},
    ]);
  };

  const renderReport = ({ item }: any) => {
    const status = REPORT_STATUS[item.status];
    const reportType = REPORT_TYPE[item.type];
    const hasPDF = !!item.pdfUrl;

    return (
      <TouchableOpacity 
        style={styles.reportCard}
        activeOpacity={0.9}
        onPress={() => {
          setSelectedReport(item);
          setShowReportModal(true);
        }}
      >
        {/* HEADER WITH STATUS & TYPE */}
        <View style={styles.reportHeader}>
          <View style={styles.reportIdContainer}>
            <ThemedText style={styles.reportId}>{item.id}</ThemedText>
            <View style={[styles.typeBadge, { backgroundColor: reportType.bg }]}>
              <Ionicons name={reportType.icon} size={12} color={reportType.color} />
              <ThemedText style={[styles.typeText, { color: reportType.color }]}>
                {reportType.label}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Ionicons name={status.icon} size={14} color={status.color} />
            <ThemedText style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </ThemedText>
          </View>
        </View>

        {/* PATIENT INFO */}
        <View style={styles.patientRow}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>
              {item.patient.split(' ').map((n: string) => n[0]).join('')}
            </ThemedText>
          </View>
          <View style={styles.patientInfo}>
            <ThemedText style={styles.patientName}>{item.patient}</ThemedText>
            <View style={styles.patientMeta}>
              <ThemedText style={styles.patientDetail}>{item.age}y • {item.gender}</ThemedText>
              <ThemedText style={styles.patientId}>{item.patientId}</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.reportDate}>
            {item.date === "2024-01-15" ? "Today" : "Yesterday"}
          </ThemedText>
        </View>

        {/* TEST DETAILS */}
        <View style={styles.testSection}>
          <ThemedText style={styles.testName}>{item.test}</ThemedText>
          <View style={styles.testMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="flask" size={12} color={COLORS.muted} />
              <ThemedText style={styles.metaText}>{item.lab}</ThemedText>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="medical" size={12} color={COLORS.muted} />
              <ThemedText style={styles.metaText}>{item.doctor}</ThemedText>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={12} color={COLORS.muted} />
              <ThemedText style={styles.metaText}>{item.time}</ThemedText>
            </View>
          </View>
        </View>

        {/* QUICK RESULTS PREVIEW */}
        <View style={styles.resultsPreview}>
          {item.results.slice(0, 2).map((result: any, index: number) => (
            <View key={index} style={styles.resultPreviewItem}>
              <ThemedText style={styles.previewParam}>{result.parameter}</ThemedText>
              <View style={styles.previewValueRow}>
                <ThemedText style={[
                  styles.previewValue,
                  { color: result.flag === 'normal' ? COLORS.normal : 
                          result.flag === 'critical' ? COLORS.critical : COLORS.abnormal }
                ]}>
                  {result.value}
                </ThemedText>
                {result.flag && result.flag !== 'normal' && (
                  <Ionicons 
                    name={result.flag === 'critical' ? "warning" : "alert-circle"} 
                    size={12} 
                    color={result.flag === 'critical' ? COLORS.critical : COLORS.abnormal} 
                  />
                )}
              </View>
            </View>
          ))}
          {item.results.length > 2 && (
            <ThemedText style={styles.moreResults}>
              +{item.results.length - 2} more parameters
            </ThemedText>
          )}
        </View>

        {/* FOOTER WITH ACTIONS */}
        <View style={styles.reportFooter}>
          <View style={styles.footerLeft}>
            <ThemedText style={styles.remarksPreview} numberOfLines={1}>
              {item.remarks}
            </ThemedText>
          </View>
          <View style={styles.actionButtons}>
            {hasPDF ? (
              <TouchableOpacity 
                style={styles.pdfButton}
                onPress={() => handleShareReport(item)}
              >
                <Ionicons name="share-outline" size={16} color={COLORS.info} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.generateButton}
                onPress={() => handleGeneratePDF(item)}
              >
                <Ionicons name="document-text" size={16} color={COLORS.warning} />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.menuButton}>
              <Ionicons name="ellipsis-vertical" size={16} color={COLORS.muted} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterChip = (key: string, label: string, count: number) => {
    const isActive = filter === key;
    const status = REPORT_STATUS[key] || { color: COLORS.primary, bg: COLORS.soft };
    
    return (
      <TouchableOpacity
        key={key}
        onPress={() => setFilter(key as any)}
        style={[
          styles.filterChip,
          isActive && styles.filterActive,
          { backgroundColor: isActive ? status.color : COLORS.soft }
        ]}
      >
        <ThemedText
          style={[
            styles.filterText,
            isActive && styles.filterTextActive,
          ]}
        >
          {label}
        </ThemedText>
        <View style={[
          styles.filterCount,
          { backgroundColor: isActive ? "#FFFFFF" : status.color + "20" }
        ]}>
          <ThemedText style={[
            styles.filterCountText,
            { color: isActive ? status.color : COLORS.muted }
          ]}>
            {count}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTypeChip = (key: string, label: string, count: number) => {
    const isActive = typeFilter === key;
    const type = REPORT_TYPE[key] || { color: COLORS.primary, bg: COLORS.soft };
    
    return (
      <TouchableOpacity
        key={key}
        onPress={() => setTypeFilter(key as any)}
        style={[
          styles.typeFilterChip,
          isActive && styles.typeFilterActive,
          { backgroundColor: isActive ? type.color : type.bg }
        ]}
      >
        <Ionicons 
          name={type.icon} 
          size={12} 
          color={isActive ? "#FFFFFF" : type.color} 
        />
        <ThemedText
          style={[
            styles.typeFilterText,
            { color: isActive ? "#FFFFFF" : type.color }
          ]}
        >
          {label}
        </ThemedText>
        <View style={[
          styles.typeFilterCount,
          { backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.5)" }
        ]}>
          <ThemedText style={[
            styles.typeFilterCountText,
            { color: isActive ? "#FFFFFF" : type.color }
          ]}>
            {count}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
        {/* 📊 HEADER WITH STATS */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <ThemedText style={styles.headerTitle}>Diagnostic Reports</ThemedText>
              <ThemedText style={styles.headerSubtitle}>Test results & analysis</ThemedText>
            </View>
            <TouchableOpacity style={styles.newReportButton}>
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <ThemedText style={styles.newReportText}>New Report</ThemedText>
            </TouchableOpacity>
          </View>
          
          {/* QUICK STATS */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Ionicons name="document-text" size={20} color="#FFFFFF" />
              <ThemedText style={styles.statValue}>{stats.total}</ThemedText>
              <ThemedText style={styles.statLabel}>Total Reports</ThemedText>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="today" size={20} color="#FFFFFF" />
              <ThemedText style={styles.statValue}>{stats.today}</ThemedText>
              <ThemedText style={styles.statLabel}>Today</ThemedText>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <ThemedText style={styles.statValue}>{stats.published}</ThemedText>
              <ThemedText style={styles.statLabel}>Published</ThemedText>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="alert-circle" size={20} color="#FFFFFF" />
              <ThemedText style={styles.statValue}>{stats.critical}</ThemedText>
              <ThemedText style={styles.statLabel}>Critical</ThemedText>
            </View>
          </View>
        </View>

        {/* 🔍 SEARCH & FILTERS */}
        <View style={styles.searchContainer}>
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color={COLORS.muted} />
              <TextInput
                placeholder="Search reports by patient, test, or ID..."
                placeholderTextColor={COLORS.mutedLight}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                clearButtonMode="while-editing"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={18} color={COLORS.muted} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilterModal(true)}
            >
              <Ionicons name="filter" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 📊 STATUS FILTER */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBar}
        >
          {renderFilterChip("all", "All Reports", stats.total)}
          {renderFilterChip("draft", "Draft", stats.draft)}
          {renderFilterChip("pending_review", "Pending Review", stats.pending_review)}
          {renderFilterChip("approved", "Approved", stats.approved)}
          {renderFilterChip("published", "Published", stats.published)}
          {renderFilterChip("amended", "Amended", stats.amended)}
        </ScrollView>

        {/* 🚨 RESULT TYPE FILTER */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typeFilterBar}
        >
          {renderTypeChip("all", "All Types", stats.total)}
          {renderTypeChip("normal", "Normal", stats.normal)}
          {renderTypeChip("abnormal", "Abnormal", stats.abnormal)}
          {renderTypeChip("critical", "Critical", stats.critical)}
        </ScrollView>

        {/* 📋 RESULTS INFO */}
        <View style={styles.resultsInfo}>
          <ThemedText style={styles.resultsText}>
            {filteredReports.length} reports found
          </ThemedText>
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="download" size={14} color={COLORS.primary} />
            <ThemedText style={styles.exportText}>Export</ThemedText>
          </TouchableOpacity>
        </View>

        {/* 📋 REPORTS LIST */}
        <FlatList
          data={filteredReports}
          renderItem={renderReport}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="document-text-outline" size={48} color={COLORS.border} />
              </View>
              <ThemedText style={styles.emptyTitle}>No reports found</ThemedText>
              <ThemedText style={styles.emptySubtitle}>
                {searchQuery ? "Try a different search" : "No reports match the selected filters"}
              </ThemedText>
            </View>
          }
        />
      </ScrollView>

      {/* 📄 REPORT DETAILS MODAL */}
      <Modal
        visible={showReportModal}
        animationType="slide"
        transparent
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Laboratory Report</ThemedText>
              <TouchableOpacity 
                style={styles.modalClose}
                onPress={() => setShowReportModal(false)}
              >
                <Ionicons name="close" size={22} color={COLORS.muted} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              {selectedReport && (
                <>
                  {/* REPORT HEADER */}
                  <View style={styles.reportHeaderSection}>
                    <View style={styles.reportHeaderRow}>
                      <ThemedText style={styles.reportHeaderId}>{selectedReport.id}</ThemedText>
                      <View style={[styles.reportHeaderStatus, { 
                        backgroundColor: REPORT_STATUS[selectedReport.status].bg 
                      }]}>
                        <ThemedText style={[styles.reportHeaderStatusText, { 
                          color: REPORT_STATUS[selectedReport.status].color 
                        }]}>
                          {REPORT_STATUS[selectedReport.status].label}
                        </ThemedText>
                      </View>
                    </View>
                    <ThemedText style={styles.reportHeaderDate}>
                      {selectedReport.date} • {selectedReport.time}
                    </ThemedText>
                  </View>

                  {/* PATIENT INFO */}
                  <View style={styles.detailSection}>
                    <ThemedText style={styles.detailSectionTitle}>Patient Information</ThemedText>
                    <View style={styles.detailGrid}>
                      <View style={styles.detailItem}>
                        <ThemedText style={styles.detailLabel}>Name</ThemedText>
                        <ThemedText style={styles.detailValue}>{selectedReport.patient}</ThemedText>
                      </View>
                      <View style={styles.detailItem}>
                        <ThemedText style={styles.detailLabel}>Patient ID</ThemedText>
                        <ThemedText style={styles.detailValue}>{selectedReport.patientId}</ThemedText>
                      </View>
                      <View style={styles.detailItem}>
                        <ThemedText style={styles.detailLabel}>Age & Gender</ThemedText>
                        <ThemedText style={styles.detailValue}>{selectedReport.age}y, {selectedReport.gender}</ThemedText>
                      </View>
                      <View style={styles.detailItem}>
                        <ThemedText style={styles.detailLabel}>Referring Doctor</ThemedText>
                        <ThemedText style={styles.detailValue}>{selectedReport.doctor}</ThemedText>
                      </View>
                    </View>
                  </View>

                  {/* TEST INFORMATION */}
                  <View style={styles.detailSection}>
                    <ThemedText style={styles.detailSectionTitle}>Test Information</ThemedText>
                    <View style={styles.testInfoBox}>
                      <View style={styles.testInfoRow}>
                        <ThemedText style={styles.testInfoLabel}>Test Name</ThemedText>
                        <ThemedText style={styles.testInfoValue}>{selectedReport.test}</ThemedText>
                      </View>
                      <View style={styles.testInfoRow}>
                        <ThemedText style={styles.testInfoLabel}>Laboratory</ThemedText>
                        <ThemedText style={styles.testInfoValue}>{selectedReport.lab}</ThemedText>
                      </View>
                      <View style={styles.testInfoRow}>
                        <ThemedText style={styles.testInfoLabel}>Report Type</ThemedText>
                        <View style={[styles.reportTypeBadge, { 
                          backgroundColor: REPORT_TYPE[selectedReport.type].bg 
                        }]}>
                          <Ionicons 
                            name={REPORT_TYPE[selectedReport.type].icon} 
                            size={14} 
                            color={REPORT_TYPE[selectedReport.type].color} 
                          />
                          <ThemedText style={[styles.reportTypeText, { 
                            color: REPORT_TYPE[selectedReport.type].color 
                          }]}>
                            {REPORT_TYPE[selectedReport.type].label}
                          </ThemedText>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* RESULTS TABLE */}
                  <View style={styles.detailSection}>
                    <ThemedText style={styles.detailSectionTitle}>Test Results</ThemedText>
                    <View style={styles.resultsTable}>
                      <View style={styles.tableHeader}>
                        <ThemedText style={styles.tableHeaderText}>Parameter</ThemedText>
                        <ThemedText style={styles.tableHeaderText}>Result</ThemedText>
                        <ThemedText style={styles.tableHeaderText}>Normal Range</ThemedText>
                        <ThemedText style={styles.tableHeaderText}>Flag</ThemedText>
                      </View>
                      {selectedReport.results.map((result: any, index: number) => (
                        <View key={index} style={[
                          styles.tableRow,
                          index % 2 === 0 && styles.tableRowEven
                        ]}>
                          <ThemedText style={styles.tableCell}>{result.parameter}</ThemedText>
                          <ThemedText style={[
                            styles.tableCell,
                            styles.tableCellValue,
                            { color: result.flag === 'normal' ? COLORS.normal : 
                                    result.flag === 'critical' ? COLORS.critical : COLORS.abnormal }
                          ]}>
                            {result.value}
                          </ThemedText>
                          <ThemedText style={styles.tableCell}>{result.normalRange}</ThemedText>
                          <View style={styles.tableCell}>
                            {result.flag && result.flag !== 'normal' ? (
                              <Ionicons 
                                name={result.flag === 'critical' ? "warning" : "alert-circle"} 
                                size={16} 
                                color={result.flag === 'critical' ? COLORS.critical : COLORS.abnormal} 
                              />
                            ) : (
                              <Ionicons name="checkmark-circle" size={16} color={COLORS.normal} />
                            )}
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* REMARKS */}
                  <View style={styles.detailSection}>
                    <ThemedText style={styles.detailSectionTitle}>Interpretation & Remarks</ThemedText>
                    <View style={styles.remarksBox}>
                      <ThemedText style={styles.remarksText}>{selectedReport.remarks}</ThemedText>
                    </View>
                  </View>

                  {/* QUALITY CONTROL */}
                  <View style={styles.detailSection}>
                    <ThemedText style={styles.detailSectionTitle}>Quality Control</ThemedText>
                    <View style={styles.qualityBox}>
                      <View style={styles.qualityRow}>
                        <ThemedText style={styles.qualityLabel}>Reviewed By</ThemedText>
                        <ThemedText style={styles.qualityValue}>
                          {selectedReport.reviewedBy || "Pending Review"}
                        </ThemedText>
                      </View>
                      <View style={styles.qualityRow}>
                        <ThemedText style={styles.qualityLabel}>Report Status</ThemedText>
                        <ThemedText style={[styles.qualityValue, { 
                          color: REPORT_STATUS[selectedReport.status].color,
                          fontWeight: '700'
                        }]}>
                          {REPORT_STATUS[selectedReport.status].label}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>

            {/* MODAL ACTIONS */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => setShowReportModal(false)}
              >
                <ThemedText style={styles.secondaryButtonText}>Close</ThemedText>
              </TouchableOpacity>
              {selectedReport?.pdfUrl ? (
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={() => handleShareReport(selectedReport)}
                >
                  <Ionicons name="share-outline" size={18} color="#FFFFFF" />
                  <ThemedText style={styles.primaryButtonText}>Share Report</ThemedText>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.warningButton}
                  onPress={() => handleGeneratePDF(selectedReport)}
                >
                  <Ionicons name="document-text" size={18} color="#FFFFFF" />
                  <ThemedText style={styles.primaryButtonText}>Generate PDF</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* 🎨 ENHANCED REPORTS STYLES */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  page: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  /* HEADER */
  header: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: 40,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    fontWeight: "500",
  },
  newReportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  newReportText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  /* STATS ROW */
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    fontWeight: "600",
  },

  /* SEARCH */
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: "row",
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    marginLeft: 12,
    fontSize: 15,
    flex: 1,
    color: COLORS.text,
    fontWeight: "500",
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.soft,
    alignItems: "center",
    justifyContent: "center",
  },

  /* FILTER BARS */
  filterBar: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  typeFilterBar: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    minWidth: 100,
    gap: 6,
  },
  filterActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  filterCount: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: "center",
  },
  filterCountText: {
    fontSize: 12,
    fontWeight: "800",
  },
  typeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  typeFilterActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  typeFilterText: {
    fontSize: 13,
    fontWeight: "700",
  },
  typeFilterCount: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
  },
  typeFilterCountText: {
    fontSize: 11,
    fontWeight: "800",
  },

  /* RESULTS INFO */
  resultsInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.soft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  exportText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "600",
  },

  /* LIST */
  list: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  /* REPORT CARD */
  reportCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  reportIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reportId: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.muted,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  typeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  /* PATIENT INFO */
  patientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.primary,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 2,
  },
  patientMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  patientDetail: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "600",
  },
  patientId: {
    fontSize: 12,
    color: COLORS.mutedLight,
    fontWeight: "600",
  },
  reportDate: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.muted,
  },

  /* TEST SECTION */
  testSection: {
    marginBottom: 16,
  },
  testName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  testMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "600",
  },

  /* RESULTS PREVIEW */
  resultsPreview: {
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  resultPreviewItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  previewParam: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: "600",
    flex: 1,
  },
  previewValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  previewValue: {
    fontSize: 13,
    fontWeight: "700",
  },
  moreResults: {
    fontSize: 12,
    color: COLORS.muted,
    fontStyle: "italic",
    marginTop: 4,
  },

  /* REPORT FOOTER */
  reportFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  footerLeft: {
    flex: 1,
    marginRight: 12,
  },
  remarksPreview: {
    fontSize: 13,
    color: COLORS.textLight,
    fontStyle: "italic",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  pdfButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${COLORS.info}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  generateButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${COLORS.warning}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  menuButton: {
    padding: 6,
  },

  /* EMPTY STATE */
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.borderLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
    maxWidth: 250,
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    padding: 24,
  },
  
  /* REPORT HEADER IN MODAL */
  reportHeaderSection: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  reportHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reportHeaderId: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  reportHeaderStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  reportHeaderStatusText: {
    fontSize: 13,
    fontWeight: "700",
  },
  reportHeaderDate: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "600",
  },

  /* DETAIL SECTIONS */
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  detailItem: {
    width: "48%",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "600",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "600",
  },

  /* TEST INFO BOX */
  testInfoBox: {
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    padding: 16,
  },
  testInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  testInfoLabel: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "600",
  },
  testInfoValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },
  reportTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  reportTypeText: {
    fontSize: 13,
    fontWeight: "700",
  },

  /* RESULTS TABLE */
  resultsTable: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.soft,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
  },
  tableRowEven: {
    backgroundColor: COLORS.bg,
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "600",
  },
  tableCellValue: {
    fontWeight: "700",
  },

  /* REMARKS BOX */
  remarksBox: {
    backgroundColor: COLORS.soft,
    padding: 16,
    borderRadius: 12,
  },
  remarksText: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },

  /* QUALITY BOX */
  qualityBox: {
    backgroundColor: COLORS.bg,
    padding: 16,
    borderRadius: 12,
  },
  qualityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  qualityLabel: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "600",
  },
  qualityValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },

  /* MODAL ACTIONS */
  modalActions: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: COLORS.borderLight,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.muted,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    gap: 8,
  },
  warningButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: COLORS.warning,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});