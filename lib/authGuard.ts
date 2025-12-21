import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth as firebaseAuth } from "./firebaseConfig";

/* -------------------------------------------
   SAVE SESSION (MOBILE ONLY)
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
   FIXED AUTH GUARD (DEVICE-ONLY SESSION)
-------------------------------------------- */
export function authGuard(
  callback: (result: {
    loading: boolean;
    authenticated: boolean;
    approved: boolean;
    role?: string;
  }) => void
) {
  // Begin in loading state
  callback({
    loading: true,
    authenticated: false,
    approved: false,
  });

  return onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
    // 1) ALWAYS load local mobile session first
    const session = await loadSession();

    // If mobile session exists → logged in (NO firebase override)
    if (session) {
      callback({
        loading: false,
        authenticated: true,
        approved: session.status === "approved",
        role: session.role,
      });
      return;
    }

    // 2) No local session → treat as logged out
    // EVEN IF firebaseUser EXISTS
    // (firebaseUser is ignored unless login/signup saves session)
    if (!session) {
      callback({
        loading: false,
        authenticated: false,
        approved: false,
      });
      return;
    }
  });
}