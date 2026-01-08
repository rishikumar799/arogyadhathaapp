import MobileDashboard from "@/components/diagnostics/dashboards/MobileDashboard";
import WebDashboard from "@/components/diagnostics/dashboards/WebDashboard";
import { Platform } from "react-native";

export default function DoctorIndex() {
  return Platform.OS === "web"
    ? <WebDashboard />
    : <MobileDashboard />;
}
