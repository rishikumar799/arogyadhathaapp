import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth as firebaseAuth } from "./firebaseConfig";

/* -------------------------------------------
   SAVE SESSION (for mobile auto-login)
-------------------------------------------- */
export async function saveSession(data: any) {
  try {
    await AsyncStorage.setItem("session", JSON.stringify(data));
  } catch (e) {
    console.warn("Session save error", e);
  }
}

/* -------------------------------------------
   LOAD SESSION
-------------------------------------------- */
export async function loadSession() {
  try {
    const d = await AsyncStorage.getItem("session");
    return d ? JSON.parse(d) : null;
  } catch {
    return null;
  }
}

/* -------------------------------------------
   CLEAR SESSION
-------------------------------------------- */
export async function clearSession() {
  try {
    await AsyncStorage.removeItem("session");
  } catch {}
}

/* -------------------------------------------
   FIREBASE AUTH GUARD (real-time listener)
-------------------------------------------- */
export function authGuard(
  callback: (result: {
    loading: boolean;
    authenticated: boolean;
    approved: boolean;
    role?: string;
  }) => void
) {
  callback({ loading: true, authenticated: false, approved: false });

  return onAuthStateChanged(firebaseAuth, async (user) => {
    if (!user) {
      callback({ loading: false, authenticated: false, approved: false });
      return;
    }

    const uid = user.uid;

    // Approved users
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const data = userDoc.data();

      // SAVE LOCAL SESSION FOR AUTO LOGIN
      await saveSession({
        uid,
        email: user.email,
        role: data.role,
        status: "approved",
      });

      callback({
        loading: false,
        authenticated: true,
        approved: true,
        role: data.role,
      });
      return;
    }

    // Pending users
    const reqDoc = await getDoc(doc(db, "requests", uid));
    if (reqDoc.exists()) {
      const data = reqDoc.data();

      await saveSession({
        uid,
        email: user.email,
        role: data.role,
        status: "pending",
      });

      callback({
        loading: false,
        authenticated: true,
        approved: false,
        role: data.role,
      });
      return;
    }

    // No data found
    callback({
      loading: false,
      authenticated: false,
      approved: false,
    });
  });
}
