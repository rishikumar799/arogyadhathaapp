export type ServiceCard = {
  id: string;
  title: string;
  route: string;
  icon?: string;
  description?: string;
  featured?: boolean;
};

export const SERVICES: ServiceCard[] = [
  {
    id: 'symptom-checker',
    title: 'AI Symptom Checker',
    route: '/(main)/patient/settings/symptom-checker',
    icon: 'stethoscope',
    description: 'Check symptoms and get guidance',
    featured: true,
  },
  {
    id: 'appointments',
    title: 'Appointments',
    route: '/(main)/patient/appointments',
    icon: 'calendar',
    description: 'Book and view appointments',
  },
  {
    id: 'diagnostics',
    title: 'Diagnostics',
    route: '/(main)/diagnostics',
    icon: 'flask',
    description: 'Book lab tests and view results',
  },
  {
    id: 'medicines',
    title: 'Medicines',
    route: '/(main)/patient/medicines',
    icon: 'pills',
    description: 'Search medicines and order refills',
  },
  {
    id: 'lab-reports',
    title: 'Lab Reports',
    route: '/(main)/patient/lab-reports',
    icon: 'file-medical',
    description: 'View your lab results',
  },
  {
    id: 'emergency',
    title: 'Emergency',
    route: '/(main)/patient/emergency',
    icon: 'ambulance',
    description: 'Emergency services and helpline',
    featured: true,
  },
  {
    id: 'insurances',
    title: 'Insurances',
    route: '/(main)/patient/insurances',
    icon: 'shield',
    description: 'Manage insurance and claims',
  },
];

export function getServiceById(id: string): ServiceCard | undefined {
  return SERVICES.find((s) => s.id === id);
}

export function getFeaturedServices(): ServiceCard[] {
  return SERVICES.filter((s) => s.featured);
}
