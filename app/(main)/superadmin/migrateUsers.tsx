import { ThemedText } from "@/components/themed-text";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { Alert, Pressable, View } from "react-native";

/* NORMALIZE ROLE */
function normalizeRole(role?: string) {
  return (role || "").trim().toLowerCase();
}

/* ROLE → COLLECTION (LOWERCASE ONLY) */
const ROLE_COLLECTION_MAP: Record<string, string> = {
  doctor: "doctors",
  patient: "patients",
  diagnostics: "diagnostics",
  pharmacy: "pharmacies",
  receptionist: "receptionists",
  hospital: "hospitals",
};

async function migrateAllUsersOnce() {
  const usersSnap = await getDocs(collection(db, "users"));
  let migrated = 0;

  for (const d of usersSnap.docs) {
    const u = d.data() as any;
    const uid = d.id;

    const role = normalizeRole(u.role);
    const roleCollection = ROLE_COLLECTION_MAP[role];

    if (!roleCollection) continue;

    /* 🔹 ROLE-SPECIFIC COLLECTION */
    await setDoc(
      doc(db, roleCollection, uid),
      {
        uid,
        name: u.name || "",
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        email: u.email || "",
        phone: u.phone || "",
        status: u.status || "approved",
        migratedFromUsers: true,
        createdAt: u.createdAt || serverTimestamp(),
      },
      { merge: true }
    );

    /* 🔹 HOSPITAL CONFIG (ONLY FOR HOSPITALS) */
    if (role === "hospital") {
      await setDoc(
        doc(db, "hospitalConfigs", uid),
        {
          registrationApprovals: true,
          staffManagement: true,
          rolePermissions: true,
          moduleDoctors: true,
          modulePatients: true,
          moduleDiagnostics: true,
          modulePharmacy: true,
          branding: false,
          reports: false,
          migratedFromUsers: true,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    migrated++;
  }

  return migrated;
}

/* ✅ SCREEN */
export default function MigrateUsersScreen() {
  const runMigration = async () => {
    try {
      const total = await migrateAllUsersOnce();
      Alert.alert(
        "Migration Complete",
        `Successfully migrated ${total} users`
      );
    } catch (e: any) {
      Alert.alert("Migration Failed", e.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Pressable
        onPress={runMigration}
        style={{
          backgroundColor: "#DC2626",
          padding: 16,
          borderRadius: 12,
        }}
      >
        <ThemedText
          style={{
            color: "#FFF",
            fontWeight: "800",
            textAlign: "center",
          }}
        >
          RUN USER MIGRATION (ONE TIME)
        </ThemedText>
      </Pressable>
    </View>
  );
}
