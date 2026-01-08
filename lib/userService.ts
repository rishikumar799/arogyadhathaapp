import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { auth as firebaseAuth, db as firebaseDB } from "./firebaseConfig";

/* ---------------------------------------------------------
   ERROR MAPPER
--------------------------------------------------------- */
function mapFirebaseError(e: any) {
  const code = (e?.code || "").toLowerCase();

  if (code === "auth/wrong-password") return "WRONG_PASSWORD";
  if (code === "auth/user-not-found") return "EMAIL_NOT_REGISTERED";
  if (code === "auth/invalid-email") return "INVALID_EMAIL";
  if (code === "auth/invalid-credential") return "WRONG_PASSWORD";
  if (code === "auth/email-already-in-use") return "EMAIL_ALREADY_EXISTS";
  if (code === "auth/weak-password") return "WEAK_PASSWORD";

  return "GENERIC_ERROR";
}

/* ---------------------------------------------------------
   FIND USER BY EMAIL
--------------------------------------------------------- */
async function findUserByEmail(email: string) {
  const clean = email.trim().toLowerCase();

  // USERS (patients)
  const q1 = query(collection(firebaseDB, "users"), where("email", "==", clean));
  const s1 = await getDocs(q1);

  if (!s1.empty) {
    const docSnap = s1.docs[0];
    return {
      type: "patient",
      data: { uid: docSnap.id, ...docSnap.data() },
    };
  }

  // REQUESTS (staff)
  const q2 = query(
    collection(firebaseDB, "requests"),
    where("email", "==", clean)
  );
  const s2 = await getDocs(q2);

  if (!s2.empty) {
    const docSnap = s2.docs[0];
    return {
      type: "request",
      data: { uid: docSnap.id, ...docSnap.data() },
    };
  }

  return null;
}

/* ---------------------------------------------------------
   SIGN IN
--------------------------------------------------------- */
export async function signInUser(email: string, password: string) {
  try {
    const clean = email.trim().toLowerCase();

    // 🔴 Firestore check first (unchanged logic)
    const found = await findUserByEmail(clean);

    if (!found) {
      return { success: false, message: "EMAIL_NOT_REGISTERED" };
    }

    // 🔴 Auth
    await signInWithEmailAndPassword(firebaseAuth, clean, password);

    // PATIENT
    if (found.type === "patient") {
      return {
        success: true,
        status: "approved",
        role: found.data.role,
        name: found.data.name || "",
        firstName: found.data.firstName || "",
        lastName: found.data.lastName || "",
        uid: found.data.uid,
      };
    }

    // STAFF
    if (found.data.status === "pending") {
      return {
        success: false,
        status: "pending",
        message: "PENDING_APPROVAL",
      };
    }

    return {
      success: true,
      status: "approved",
      role: found.data.role,
    };
  } catch (e: any) {
    return { success: false, message: mapFirebaseError(e) };
  }
}

/* ---------------------------------------------------------
   SIGN UP (OPTIMIZED – SAME LOGIC)
--------------------------------------------------------- */
export async function signUpUser({
  name,
  firstName,
  lastName,
  email,
  phone,
  password,
  role = "patient",
}: {
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  password: string;
  role?: string;
}) {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = role.trim().toLowerCase();

    /* 1️⃣ AUTH — THIS IS THE ONLY TRUE BOTTLENECK */
    const userCred = await createUserWithEmailAndPassword(
      firebaseAuth,
      cleanEmail,
      password
    );

    const uid = userCred.user.uid;

    const payload = {
      uid,
      name,
      firstName: firstName || "",
      lastName: lastName || "",
      email: cleanEmail,
      phone: phone || "",
      role: cleanRole,
      createdAt: serverTimestamp(),
    };

    /* ===================== PATIENT ===================== */
    if (cleanRole === "patient") {
      // 🚀 Firestore writes in background (NON-BLOCKING)
      Promise.all([
        setDoc(doc(firebaseDB, "users", uid), {
          ...payload,
          status: "approved",
        }),
        setDoc(doc(firebaseDB, "patients", uid), {
          uid,
          firstName: payload.firstName,
          lastName: payload.lastName,
          name,
          email: cleanEmail,
          phone: phone || "",
          status: "approved",
          createdAt: payload.createdAt,
        }),
      ]).catch(console.error);

      // 💨 UI responds immediately
      return { success: true, status: "approved", uid };
    }

    /* ===================== STAFF ===================== */
    setDoc(doc(firebaseDB, "requests", uid), {
      ...payload,
      status: "pending",
    }).catch(console.error);

    return { success: true, status: "pending", uid };
  } catch (err: any) {
    return { success: false, message: mapFirebaseError(err) };
  }
}
