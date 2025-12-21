// lib/logout.ts
import { clearSession } from "./authPersist"; // mobile session
import { auth as firebaseAuth } from "./firebaseConfig";
import { clearWebSession } from "./webPersist"; // web session

/**
 * logoutUser(device)
 * - device: "mobile" | "web"
 *
 * Mobile logout:
 *   - clears only AsyncStorage session (does NOT sign out Firebase)
 *
 * Web logout:
 *   - clears localStorage session
 *   - ALSO signs out Firebase (because web auth persists in memory)
 */
export async function logoutUser(device: "mobile" | "web") {
  try {
    if (device === "mobile") {
      // Device-isolated logout (no Firebase signOut)
      await clearSession();
    } 
    
    else if (device === "web") {
      // Clear saved web session
      await clearWebSession();
      
      // MUST sign out Firebase on web or auth.currentUser stays alive
      await firebaseAuth.signOut();
    }

  } catch (e) {
    console.warn("Logout error:", e);
  }
}
