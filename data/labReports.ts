export type LabTest = { name: string; result: string | number; unit?: string; refRange?: string };

export type LabReport = {
  id: string;
  patientId: string;
  date: string; // ISO
  tests: LabTest[];
  notes?: string;
};

export const LAB_REPORTS: LabReport[] = [
  {
    id: 'r1',
    patientId: 'p1',
    date: new Date().toISOString(),
    tests: [
      { name: 'Hemoglobin', result: 13.5, unit: 'g/dL', refRange: '12-16' },
      { name: 'WBC', result: 6500, unit: '/µL', refRange: '4000-11000' },
    ],
  },
];

export function getReportsForPatient(patientId: string) {
  return LAB_REPORTS.filter((r) => r.patientId === patientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
