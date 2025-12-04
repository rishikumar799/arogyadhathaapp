export type Appointment = {
  id: string;
  patientId: string;
  doctorId?: string;
  date: string; // ISO
  status: 'upcoming' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
};

export const APPOINTMENTS: Appointment[] = [
  // sample
  { id: 'a1', patientId: 'p1', doctorId: 'd1', date: new Date(Date.now() + 86400000).toISOString(), status: 'upcoming', notes: '' },
];

export function getUpcomingForPatient(patientId: string) {
  const now = Date.now();
  return APPOINTMENTS.filter((a) => a.patientId === patientId && new Date(a.date).getTime() > now && a.status === 'upcoming');
}
