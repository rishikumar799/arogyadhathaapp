import { SERVICES } from '@/lib/serviceList';

export const SERVICE_CARDS = SERVICES;

export function getService(id: string) {
  return SERVICES.find((s) => s.id === id);
}
