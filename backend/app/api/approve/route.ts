import { NextResponse } from "next/server";
import { adminDB } from "../../../lib/firebaseAdmin";

export async function POST(req: Request) {
  const { uid } = await req.json();

  const snap = await adminDB.collection("requests").doc(uid).get();
  if (!snap.exists) return NextResponse.json({ success: false });

  const data = snap.data();

  // Move to users collection
  await adminDB.collection("users").doc(uid).set(data);

  // Delete from requests
  await adminDB.collection("requests").doc(uid).delete();

  return NextResponse.json({ success: true });
}
