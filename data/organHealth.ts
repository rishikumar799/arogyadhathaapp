import { ORGANS } from '@/lib/healthData';

export const ORGAN_HEALTH_SUMMARY = ORGANS.map((o) => ({ id: o.id, name: o.name, short: o.short }));

export function getOrganById(id: string) {
  return ORGANS.find((o) => o.id === id);
}
