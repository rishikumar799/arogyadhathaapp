import { getApps, initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { firebaseConfig } from "./firebaseConfig";

/* ✅ SINGLE APP INSTANCE */
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

/* ✅ STORAGE FROM SAME APP */
const storage = getStorage(app);

export async function uploadAnnouncementImage(
  file: File,
  announcementId: string
): Promise<string> {
  const imageRef = ref(
    storage,
    `announcement-images/${announcementId}.jpg`
  );

  await uploadBytes(imageRef, file, {
    contentType: file.type,
  });

  const downloadURL = await getDownloadURL(imageRef);
  return downloadURL;
}
