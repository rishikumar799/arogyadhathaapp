import { Platform } from "react-native";

import MobileDashboard from "@/components/superadmin/dashboards/MobileDashboard";
import WebDashboard from "@/components/superadmin/dashboards/WebDashboard";

export default function SuperadminIndex() {
  return Platform.OS === "web"
    ? <WebDashboard />
    : <MobileDashboard />;
}
