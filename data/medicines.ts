export type Medicine = {
  id: string;
  name: string;
  manufacturer?: string;
  dose?: string;
  price?: number;
};

export const MEDICINES: Medicine[] = [
  { id: 'm1', name: 'Paracetamol', manufacturer: 'ACME', dose: '500mg', price: 20 },
  { id: 'm2', name: 'Amoxicillin', manufacturer: 'ACME', dose: '250mg', price: 50 },
];

export function findMedicineByName(q: string) {
  const s = q.trim().toLowerCase();
  return MEDICINES.filter((m) => m.name.toLowerCase().includes(s));
}
