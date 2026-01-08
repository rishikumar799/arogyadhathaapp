import { db } from "@/lib/firebaseConfig";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export async function uploadMedicalReport({
  uid,
  organKey,
  file,
}: {
  uid: string;
  organKey: string;
  file: Blob;
}) {
  const storage = getStorage();

  const fileRef = ref(
    storage,
    `medical-reports/${uid}/${organKey}-${Date.now()}`
  );

  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);

  await setDoc(
    doc(db, "users", uid, "organhealth", organKey),
    {
      reportUrl: url,
      source: "manual",
      status: "Pending Review",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return url;
}
