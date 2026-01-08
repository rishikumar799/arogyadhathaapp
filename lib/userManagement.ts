import { db } from "@/lib/firebaseConfig";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

/* ======================================================
   ROLE → COLLECTION MAP
====================================================== */

const ROLE_COLLECTION_MAP: Record<string, string> = {
  diagnostics: "diagnostics",
  receptionist: "receptionists",
  doctor: "doctors",
  pharmacy: "pharmacies",
  hospital: "hospitals",
  patient: "patients",
};

/* ======================================================
   INTERNAL HELPERS
====================================================== */

function sanitize<T extends Record<string, any>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as T;
}

function normalizeRole(role?: string) {
  return (role || "").toLowerCase().trim();
}

function resolveName(data: any) {
  if (data.name) return data.name;
  const full = `${data.firstName || ""} ${data.lastName || ""}`.trim();
  return full || "Unnamed";
}

/* ======================================================
   SOFT DELETE (ALL ROLES, COMPLETE)
====================================================== */

export async function softDeleteUser(
  uid: string,
  adminUid: string
) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  const rawData = snap.data();
  const role = normalizeRole(rawData.role);
  const roleCollection = ROLE_COLLECTION_MAP[role];

  const originalData = sanitize({ ...rawData });

  await setDoc(
    doc(db, "usermanagement", uid),
    sanitize({
      uid,
      role,
      name: resolveName(rawData),
      email: rawData.email || "",
      phone: rawData.phone || "",
      status: rawData.status || "approved",
      deletedAt: serverTimestamp(),
      deletedBy: adminUid,
      sourceCollection: "users",
      originalData,
    })
  );

  await deleteDoc(userRef);

  if (roleCollection) {
    await deleteDoc(doc(db, roleCollection, uid));
  }
}

/* ======================================================
   RESTORE (ALL ROLES, COMPLETE)
====================================================== */

export async function restoreUser(uid: string) {
  const removedRef = doc(db, "usermanagement", uid);
  const snap = await getDoc(removedRef);
  if (!snap.exists()) return;

  const data = snap.data();
  const role = normalizeRole(data.role);
  const roleCollection = ROLE_COLLECTION_MAP[role];

  const restoredUser = sanitize({
    ...data.originalData,
    restoredAt: serverTimestamp(),
  });

  await setDoc(doc(db, "users", uid), restoredUser, { merge: true });

  if (roleCollection) {
    await setDoc(doc(db, roleCollection, uid), restoredUser, { merge: true });
  }

  await deleteDoc(removedRef);
}

/* ======================================================
   PERMANENT DELETE
====================================================== */

export async function permanentlyDeleteUser(uid: string) {
  await deleteDoc(doc(db, "usermanagement", uid));
}

/* ======================================================
   CHECK HELPERS
====================================================== */

export async function isUserDeleted(uid: string): Promise<boolean> {
  const snap = await getDoc(doc(db, "usermanagement", uid));
  return snap.exists();
}
