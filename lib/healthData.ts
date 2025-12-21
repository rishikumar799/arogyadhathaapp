export type OrganMetric = {
  key: string;
  label: string;
  value?: string | number;
  unit?: string;
};

export type OrganOverview = {
  id: string;
  name: string;
  short: string;
  description?: string;
  metrics?: OrganMetric[];
  recommendedActions?: string[];
};

export const ORGANS: OrganOverview[] = [
  {
    id: 'heart',
    name: 'Heart',
    short: 'Cardiovascular health',
    description: 'Monitors heart rate, blood pressure and related cardiovascular indicators.',
    metrics: [
      { key: 'hr', label: 'Heart Rate', unit: 'bpm' },
      { key: 'bp', label: 'Blood Pressure', unit: 'mmHg' },
    ],
    recommendedActions: ['Maintain healthy diet', 'Regular exercise', 'Monitor blood pressure regularly'],
  },
  {
    id: 'liver',
    name: 'Liver',
    short: 'Liver function',
    metrics: [{ key: 'alt', label: 'ALT', unit: 'U/L' }, { key: 'ast', label: 'AST', unit: 'U/L' }],
    recommendedActions: ['Avoid excessive alcohol', 'Regular liver function tests'],
  },
  {
    id: 'kidneys',
    name: 'Kidneys',
    short: 'Renal health',
    metrics: [{ key: 'egfr', label: 'eGFR', unit: 'mL/min/1.73m2' }],
    recommendedActions: ['Maintain hydration', 'Control blood sugar and blood pressure'],
  },
  {
    id: 'lungs',
    name: 'Lungs',
    short: 'Respiratory health',
    metrics: [{ key: 'spo2', label: 'SpO2', unit: '%' }],
    recommendedActions: ['Avoid smoking', 'Seek care for persistent cough'],
  },
  {
    id: 'brain',
    name: 'Brain',
    short: 'Neurological health',
    metrics: [{ key: 'cognitiveScore', label: 'Cognitive score' }],
    recommendedActions: ['Mental exercises', 'Regular checkups when symptomatic'],
  },
];

export function getOrganOverview(id: string): OrganOverview | undefined {
  return ORGANS.find((o) => o.id === id);
}

export function listAllOrgans(): OrganOverview[] {
  return ORGANS;
}
