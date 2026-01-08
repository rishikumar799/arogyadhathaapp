import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const ORGANS = ["heart", "liver", "kidneys", "lungs", "brain", "stomach"];

export async function getOrganHealth(uid: string) {
  const result: Record<string, any> = {};

  await Promise.all(
    ORGANS.map(async (org) => {
      const ref = doc(db, "users", uid, "organhealth", org);
      const snap = await getDoc(ref);
      result[org] = snap.exists() ? snap.data() : null;
    })
  );

  return result;
}
