// 📁 diagnostics/Patients/index.tsx
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function Patients() {
  const metrics = [
    { label: 'Tests Today', value: '128', change: '+12%', color: '#3B82F6' },
    { label: 'Revenue', value: '₹45,600', change: '+8%', color: '#10B981' },
    { label: 'Avg TAT', value: '2.4h', change: '-0.3h', color: '#8B5CF6' },
    { label: 'Accuracy', value: '99.2%', change: '+0.4%', color: '#F59E0B' },
  ];

  const departments = [
    { name: 'Hematology', value: 42, color: '#3B82F6' },
    { name: 'Biochemistry', value: 38, color: '#10B981' },
    { name: 'Microbiology', value: 28, color: '#8B5CF6' },
    { name: 'Pathology', value: 20, color: '#F59E0B' },
  ];

  return (
    <ScrollView style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>Patients Dashboard</ThemedText>
        <View style={styles.dateSelector}>
          <ThemedText style={styles.dateText}>Dec 2024</ThemedText>
          <Ionicons name="chevron-down" size={16} color="#64748B" />
        </View>
      </View>

      {/* Metrics Grid */}
      <View style={styles.metricsGrid}>
        {metrics.map((metric) => (
          <View key={metric.label} style={[styles.metricCard, { borderLeftColor: metric.color }]}>
            <ThemedText style={styles.metricValue}>{metric.value}</ThemedText>
            <ThemedText style={styles.metricLabel}>{metric.label}</ThemedText>
            <View style={styles.changeBadge}>
              <ThemedText style={[styles.changeText, { color: metric.change.includes('+') ? '#10B981' : '#EF4444' }]}>
                {metric.change}
              </ThemedText>
            </View>
          </View>
        ))}
      </View>

      {/* Department Distribution */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Department Distribution</ThemedText>
        {departments.map((dept) => (
          <View key={dept.name} style={styles.deptRow}>
            <View style={styles.deptInfo}>
              <View style={[styles.deptDot, { backgroundColor: dept.color }]} />
              <ThemedText style={styles.deptName}>{dept.name}</ThemedText>
            </View>
            <ThemedText style={styles.deptValue}>{dept.value} tests</ThemedText>
          </View>
        ))}
      </View>

      {/* Trend Graph */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Daily Trend</ThemedText>
        <View style={styles.graph}>
          {[65, 48, 72, 56, 85, 42, 68].map((value, index) => (
            <View key={index} style={styles.graphBar}>
              <View style={[styles.bar, { height: value }]} />
              <ThemedText style={styles.graphLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</ThemedText>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
  dateSelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  dateText: { color: '#64748B', marginRight: 4 },
  metricsGrid: { padding: 16, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  metricCard: { backgroundColor: 'white', padding: 16, borderRadius: 12, width: '48%', marginBottom: 12, borderLeftWidth: 4 },
  metricValue: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  metricLabel: { fontSize: 14, color: '#64748B', marginBottom: 8 },
  changeBadge: { backgroundColor: '#ECFDF5', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  changeText: { fontSize: 12, fontWeight: '700' },
  section: { backgroundColor: 'white', margin: 16, padding: 20, borderRadius: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  deptRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  deptInfo: { flexDirection: 'row', alignItems: 'center' },
  deptDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  deptName: { fontSize: 16, color: '#0F172A' },
  deptValue: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  graph: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 150, marginTop: 20 },
  graphBar: { alignItems: 'center' },
  bar: { width: 20, backgroundColor: '#3B82F6', borderRadius: 6, marginBottom: 8 },
  graphLabel: { fontSize: 12, color: '#64748B' },
});