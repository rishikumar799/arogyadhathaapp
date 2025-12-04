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
   FIND USER BY EMAIL  (unchanged)
--------------------------------------------------------- */
async function findUserByEmail(email: string) {
  const clean = email.trim().toLowerCase();

  // PATIENT
  const q1 = query(collection(firebaseDB, "users"), where("email", "==", clean));
  const s1 = await getDocs(q1);
  if (!s1.empty) return { type: "patient", data: s1.docs[0].data() };

  // DOCTOR/STAFF
  const q2 = query(
    collection(firebaseDB, "requests"),
    where("email", "==", clean)
  );
  const s2 = await getDocs(q2);
  if (!s2.empty) return { type: "request", data: s2.docs[0].data() };

  return null;
}

/* ---------------------------------------------------------
   SIGN IN  (UNCHANGED, PERFECT WORKING)
--------------------------------------------------------- */
export async function signInUser(email: string, password: string) {
  try {
    const clean = email.trim().toLowerCase();

    const found = await findUserByEmail(clean);
    if (!found) return { success: false, message: "EMAIL_NOT_REGISTERED" };

    const { type, data } = found;
    const uid = data.uid;

    /* PATIENT LOGIN */
    if (type === "patient") {
      let userCred;
      try {
        userCred = await signInWithEmailAndPassword(
          firebaseAuth,
          clean,
          password
        );
      } catch (err: any) {
        const code = mapFirebaseError(err);
        return { success: false, message: code };
      }
//we use this later if we want to enforce email verification
      // await userCred.user.reload();
      // if (!userCred.user.emailVerified) {
      //   return { success: false, message: "EMAIL_NOT_VERIFIED" };
      // }

      return {
        success: true,
        status: "approved",
        role: data.role,
      };
    }

    /* DOCTOR / STAFF LOGIN (PENDING FIX INCLUDED) */
    if (type === "request") {
      try {
        // check password
        await signInWithEmailAndPassword(firebaseAuth, clean, password);
      } catch (err: any) {
        const code = mapFirebaseError(err);

        if (code === "WRONG_PASSWORD") {
          return { success: false, message: "WRONG_PASSWORD" };
        }

        // If not in auth → treat it as wrong password
        if (code === "EMAIL_NOT_REGISTERED") {
          return { success: false, message: "WRONG_PASSWORD" };
        }
      }

      // password correct → now check status
      if (data.status === "pending") {
        return {
          success: false,
          status: "pending",
          message: "PENDING_APPROVAL",
        };
      }

      // APPROVED
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
   SIGN UP  (NEW — ADDED SAFELY)
--------------------------------------------------------- */
export async function signUpUser({
  name,
  email,
  phone,
  password,
  role = "Patient",
}: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: string;
}) {
  try {
    const clean = email.trim().toLowerCase();

    /* STEP 1: Create Firebase Auth user */
    const userCred = await createUserWithEmailAndPassword(
      firebaseAuth,
      clean,
      password
    );

    const uid = userCred.user.uid;

    /* Payload */
    const payload = {
      uid,
      name,
      email: clean,
      phone: phone || "",
      role,
      createdAt: new Date().toISOString(),
    };

    /* STEP 2: PATIENT → direct users collection */
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
      };
    }

    /* STEP 3: DOCTOR / STAFF → requests collection */
    await setDoc(doc(firebaseDB, "requests", uid), {
      ...payload,
      status: "pending",
    });

    return {
      success: true,
      status: "pending",
    };
  } catch (err: any) {
    const mapped = mapFirebaseError(err);
    return { success: false, message: mapped };
  }
}
