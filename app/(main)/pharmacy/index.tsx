import MobileDashboard from "@/components/pharmacy/dashboards/MobileDashboard";
import WebDashboard from "@/components/pharmacy/dashboards/WebDashboard";
import { Platform } from "react-native";

export default function DoctorIndex() {
  return Platform.OS === "web"
    ? <WebDashboard />
    : <MobileDashboard />;
}
