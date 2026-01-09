import MobileDashboard from "@/components/hospital/dashboards/MobileDashboard";
import WebDashboard from "@/components/hospital/dashboards/WebDashboard";
import { Platform } from "react-native";

export default function DoctorIndex() {
  return Platform.OS === "web"
    ? <WebDashboard />
    : <MobileDashboard />;
}
