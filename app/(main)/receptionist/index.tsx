import MobileDashboard from "@/components/receptionist/dashboards/MobileDashboard";
import WebDashboard from "@/components/receptionist/dashboards/WebDashboard";
import { Platform } from "react-native";

export default function DoctorIndex() {
  return Platform.OS === "web"
    ? <WebDashboard />
    : <MobileDashboard />;
}
