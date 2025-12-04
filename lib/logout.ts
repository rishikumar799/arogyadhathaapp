import { signOut } from "firebase/auth";
import { clearSession } from "./authPersist";
import { auth } from "./firebaseConfig";

/* -------------------------------------------
   LOGOUT FUNCTION
-------------------------------------------- */
export async function logoutUser() {
  try {
    // Firebase logout
    await signOut(auth);
  } catch (e) {
    console.warn("Firebase logout error:", e);
  }

  // Clear saved local session (mobile)
  await clearSession();
}
