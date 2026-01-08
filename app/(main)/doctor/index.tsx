import MobileDashboard from "@/components/doctor/dashboards/MobileDashboard";
import WebDashboard from "@/components/doctor/dashboards/WebDashboard";
import { Platform } from "react-native";

export default function DoctorIndex() {
  return Platform.OS === "web"
    ? <WebDashboard />
    : <MobileDashboard />;
}
