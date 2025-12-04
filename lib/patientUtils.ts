/**
 * Small helper utilities used across patient screens
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString();
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString();
}

export function calculateBMI(weightKg: number | null | undefined, heightCm: number | null | undefined): number | null {
  if (!weightKg || !heightCm) return null;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

export function formatAge(dob: string | Date): number | null {
  const b = typeof dob === 'string' ? new Date(dob) : dob;
  if (!b || isNaN(b.getTime())) return null;
  const diff = Date.now() - b.getTime();
  const ageDt = new Date(diff);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}

export function nextAppointment(appointments: Array<{ date: string | Date }>) {
  if (!Array.isArray(appointments) || appointments.length === 0) return null;
  const now = Date.now();
  const future = appointments
    .map((a) => ({ date: typeof a.date === 'string' ? new Date(a.date) : a.date }))
    .filter((a) => a.date.getTime() > now)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return future.length ? future[0].date : null;
}
