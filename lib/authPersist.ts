import AsyncStorage from "@react-native-async-storage/async-storage";

/* -------------------------------------------
   SAVE SESSION
-------------------------------------------- */
export async function saveSession(data: any) {
  try {
    await AsyncStorage.setItem("session", JSON.stringify(data));
  } catch (e) {
    console.warn("Session save error:", e);
  }
}

/* -------------------------------------------
   LOAD SESSION
-------------------------------------------- */
export async function loadSession() {
  try {
    const data = await AsyncStorage.getItem("session");
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn("Session load error:", e);
    return null;
  }
}

/* -------------------------------------------
   CLEAR SESSION
-------------------------------------------- */
export async function clearSession() {
  try {
    await AsyncStorage.removeItem("session");
  } catch (e) {
    console.warn("Session clear error:", e);
  }
}