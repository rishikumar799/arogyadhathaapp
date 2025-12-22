import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { auth as firebaseAuth, db as firebaseDB } from "./firebaseConfig";

/* ---------------------------------------------------------
   ERROR MAPPER (UNCHANGED)
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
   FIND USER BY EMAIL (UNCHANGED)
--------------------------------------------------------- */
async function findUserByEmail(email: string) {
  const clean = email.trim().toLowerCase();

  // PATIENT
  const q1 = query(collection(firebaseDB, "users"), where("email", "==", clean));
  const s1 = await getDocs(q1);
 if (!s1.empty) {
  const docSnap = s1.docs[0];
  return {
    type: "patient",
    data: {
      uid: docSnap.id,      // ⭐ THIS WAS MISSING
      ...docSnap.data(),
    },
  };
}

  // DOCTOR / STAFF
  const q2 = query(
    collection(firebaseDB, "requests"),
    where("email", "==", clean)
  );
  const s2 = await getDocs(q2);
if (!s2.empty) {
  const docSnap = s2.docs[0];
  return {
    type: "request",
    data: {
      uid: docSnap.id,
      ...docSnap.data(),
    },
  };
}

  return null;
}

/* ---------------------------------------------------------
   SIGN IN (UNCHANGED, WORKING PERFECTLY)
--------------------------------------------------------- */
export async function signInUser(email: string, password: string) {
  try {
    const clean = email.trim().toLowerCase();

    const found = await findUserByEmail(clean);
    if (!found) return { success: false, message: "EMAIL_NOT_REGISTERED" };

    const { type, data } = found;

    /* PATIENT LOGIN */
    if (type === "patient") {
      try {
        await signInWithEmailAndPassword(firebaseAuth, clean, password);
      } catch (err: any) {
        return { success: false, message: mapFirebaseError(err) };
      }

     return {
  success: true,
  status: "approved",
  role: data.role,
  name: data.name || "",
  firstName: data.firstName || "",
  lastName: data.lastName || "",
  uid: data.uid,
};


    }

    /* DOCTOR / STAFF LOGIN */
    if (type === "request") {
      try {
        await signInWithEmailAndPassword(firebaseAuth, clean, password);
      } catch (err: any) {
        return { success: false, message: mapFirebaseError(err) };
      }

      if (data.status === "pending") {
        return {
          success: false,
          status: "pending",
          message: "PENDING_APPROVAL",
        };
      }

      return {
        success: true,
        status: "approved",
        role: data.role,
      };
    }

    return { success: false, message: "GENERIC_ERROR" };
  } catch {
    return { success: false, message: "GENERIC_ERROR" };
  }
}

/* ---------------------------------------------------------
   SIGN UP (EXTENDED — SAFE & BACKWARD COMPATIBLE)
--------------------------------------------------------- */
export async function signUpUser({
  name,
  firstName,
  lastName,
  email,
  phone,
  password,
  role = "Patient",
}: {
  name: string;              // backward compatibility
  firstName?: string;        // NEW
  lastName?: string;         // NEW
  email: string;
  phone?: string;
  password: string;
  role?: string;
}) {
  try {
    const cleanEmail = email.trim().toLowerCase();

    /* STEP 1: Create Firebase Auth user */
    const userCred = await createUserWithEmailAndPassword(
      firebaseAuth,
      cleanEmail,
      password
    );

    const uid = userCred.user.uid;

    /* STEP 2: Build payload (SAFE MERGE) */
    const payload = {
      uid,
      name,                          // legacy support
      firstName: firstName || "",    // NEW
      lastName: lastName || "",      // NEW
      email: cleanEmail,
      phone: phone || "",
      role,
      createdAt: new Date().toISOString(),
    };

    /* STEP 3: PATIENT → users collection */
    if (role === "Patient") {
      try {
        await sendEmailVerification(userCred.user);
      } catch {}

      await setDoc(doc(firebaseDB, "users", uid), {
        ...payload,
        status: "approved",
      });

      return {
        success: true,
        status: "approved",
        uid,
      };
    }

    /* STEP 4: DOCTOR / STAFF → requests collection */
    await setDoc(doc(firebaseDB, "requests", uid), {
      ...payload,
      status: "pending",
    });

    return {
      success: true,
      status: "pending",
      uid,
    };
  } catch (err: any) {
    return { success: false, message: mapFirebaseError(err) };
  }
}
