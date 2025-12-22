// lib/userUtils.ts
export function buildEntityId(uid: string, prefix: "PAT" | "DOC" | "DIA" | "PHA" | "HOS") {
  if (!uid || uid.length < 4) return "";

  // keep exact case, first 4 chars from END
  const tail = uid.slice(-4);

  // deterministic numeric part (never changes)
  const num =
    uid
      .split("")
      .reduce((acc, c) => acc + c.charCodeAt(0), 0) % 10000;

  return `${prefix}-${String(num).padStart(4, "0")}-${tail}`;
}
