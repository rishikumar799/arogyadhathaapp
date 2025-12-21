export type OrganHealthItem = {
  id: string;
  score: number | null;
  progress: number | null;
  status: string;
};

export async function fetchOrganHealth(): Promise<OrganHealthItem[]> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return [];

  const snap = await getDocs(
    collection(db, "users", user.uid, "organhealth")
  );

  return snap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      score: typeof d.score === "number" ? d.score : null,
      progress: typeof d.progress === "number" ? d.progress : null,
      status: d.status ?? "Awaiting diagnostics",
    };
  });
}
