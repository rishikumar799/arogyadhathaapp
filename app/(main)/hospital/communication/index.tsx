import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#065F46",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#0EA5E9",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
};

const communicationStats = [
  { label: "Messages", value: "128", icon: "chatbubble", color: COLORS.primary },
  { label: "Unread", value: "12", icon: "mail-unread", color: COLORS.warning },
  { label: "Alerts", value: "8", icon: "notifications", color: COLORS.danger },
  { label: "Broadcasts", value: "5", icon: "megaphone", color: COLORS.success },
];

const recentMessages = [
  { sender: "Dr. James Smith", message: "Patient report is ready", time: "10:30 AM", unread: true },
  { sender: "Lab Department", message: "Test results are available", time: "09:45 AM", unread: false },
  { sender: "Admin", message: "Meeting at 3 PM today", time: "Yesterday", unread: false },
];

const alerts = [
  { title: "Emergency Alert", message: "Code Blue in Ward 3", priority: "High", time: "11:15 AM" },
  { title: "System Update", message: "Maintenance scheduled for tonight", priority: "Medium", time: "10:00 AM" },
  { title: "Inventory Alert", message: "Low stock of surgical gloves", priority: "Low", time: "Yesterday" },
];

export default function CommunicationPage() {
  const [message, setMessage] = React.useState("");

  return (
    <ScrollView style={styles.page}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Communication</ThemedText>
          <ThemedText style={styles.subtitle}>Internal Messaging System</ThemedText>
        </View>
        <TouchableOpacity style={styles.newButton}>
          <Ionicons name="add" size={20} color="#fff" />
          <ThemedText style={styles.newButtonText}>New Message</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        {communicationStats.map((stat, idx) => (
          <View key={idx} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: stat.color + "20" }]}>
              <Ionicons name={stat.icon as any} size={20} color={stat.color} />
            </View>
            <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
            <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Quick Message</ThemedText>
        <View style={styles.messageCard}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type your message here..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={3}
          />
          <View style={styles.messageActions}>
            <TouchableOpacity style={styles.attachmentButton}>
              <Ionicons name="attach" size={20} color={COLORS.primary} />
              <ThemedText style={styles.attachmentText}>Attach</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendButton}>
              <Ionicons name="send" size={20} color="#fff" />
              <ThemedText style={styles.sendText}>Send</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Recent Messages</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAll}>View All</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {recentMessages.map((msg, idx) => (
            <TouchableOpacity key={idx} style={styles.messageRow}>
              <View style={styles.messageAvatar}>
                <Ionicons name="person" size={20} color={COLORS.primary} />
                {msg.unread && <View style={styles.unreadDot} />}
              </View>
              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <ThemedText style={styles.messageSender}>{msg.sender}</ThemedText>
                  <ThemedText style={styles.messageTime}>{msg.time}</ThemedText>
                </View>
                <ThemedText style={[styles.messageText, msg.unread && { fontWeight: "600" }]}>
                  {msg.message}
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Recent Alerts</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAll}>View All</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {alerts.map((alert, idx) => (
            <View key={idx} style={styles.alertRow}>
              <View style={[styles.alertIcon, { 
                backgroundColor: alert.priority === 'High' ? COLORS.danger + '20' : 
                               alert.priority === 'Medium' ? COLORS.warning + '20' : COLORS.info + '20' 
              }]}>
                <Ionicons 
                  name={alert.priority === 'High' ? "warning" : "information-circle"} 
                  size={20} 
                  color={alert.priority === 'High' ? COLORS.danger : 
                         alert.priority === 'Medium' ? COLORS.warning : COLORS.info} 
                />
              </View>
              <View style={styles.alertContent}>
                <View style={styles.alertHeader}>
                  <ThemedText style={styles.alertTitle}>{alert.title}</ThemedText>
                  <View style={[styles.priorityBadge, { 
                    backgroundColor: alert.priority === 'High' ? COLORS.danger + '20' : 
                                   alert.priority === 'Medium' ? COLORS.warning + '20' : COLORS.info + '20' 
                  }]}>
                    <ThemedText style={[styles.priorityText, { 
                      color: alert.priority === 'High' ? COLORS.danger : 
                             alert.priority === 'Medium' ? COLORS.warning : COLORS.info 
                    }]}>
                      {alert.priority}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.alertMessage}>{alert.message}</ThemedText>
                <ThemedText style={styles.alertTime}>{alert.time}</ThemedText>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "800" },
  subtitle: { fontSize: 14, color: COLORS.muted, marginTop: 4 },
  newButton: { backgroundColor: COLORS.primary, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 8 },
  newButtonText: { color: "#fff", fontWeight: "600" },
  stats: { paddingHorizontal: 20, flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  statCard: { width: "47%", backgroundColor: COLORS.card, borderRadius: 16, padding: 20, alignItems: "center", borderWidth: 1, borderColor: COLORS.border },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  statValue: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "800" },
  seeAll: { fontSize: 14, color: COLORS.primary, fontWeight: "600" },
  messageCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  messageInput: { minHeight: 80, fontSize: 14, color: COLORS.text, padding: 12, backgroundColor: COLORS.bg, borderRadius: 12, marginBottom: 12 },
  messageActions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  attachmentButton: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border },
  attachmentText: { fontSize: 14, fontWeight: "600", color: COLORS.primary },
  sendButton: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: COLORS.primary },
  sendText: { fontSize: 14, fontWeight: "600", color: "#fff" },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  messageRow: { flexDirection: "row", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border + "80" },
  messageAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary + "20", alignItems: "center", justifyContent: "center", marginRight: 12, position: "relative" },
  unreadDot: { position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.danger },
  messageContent: { flex: 1 },
  messageHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  messageSender: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  messageTime: { fontSize: 11, color: COLORS.muted },
  messageText: { fontSize: 13, color: COLORS.text },
  alertRow: { flexDirection: "row", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border + "80" },
  alertIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 12 },
  alertContent: { flex: 1 },
  alertHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  alertTitle: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  priorityText: { fontSize: 10, fontWeight: "600" },
  alertMessage: { fontSize: 13, color: COLORS.text, marginBottom: 4 },
  alertTime: { fontSize: 11, color: COLORS.muted },
});