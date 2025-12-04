// lib/webPersist.ts

export function saveWebSession(data: any) {
  try {
    localStorage.setItem("webSession", JSON.stringify(data));
  } catch (e) {
    console.warn("Web session save error:", e);
  }
}

export function loadWebSession() {
  try {
    const d = localStorage.getItem("webSession");
    return d ? JSON.parse(d) : null;
  } catch {
    return null;
  }
}

export function clearWebSession() {
  try {
    localStorage.removeItem("webSession");
  } catch {}
}
