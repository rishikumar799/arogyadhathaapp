import { NextResponse } from "next/server";
import { adminDB } from "../../../lib/firebaseAdmin";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password, role } = body;

    const uid = uuid();

    // PATIENT → directly add to users
    if (role === "Patient") {
      await adminDB.collection("users").doc(uid).set({
        uid,
        name,
        email,
        phone,
        role,
        createdAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        status: "approved",
        role,
      });
    }

    // Others → send request
    await adminDB.collection("requests").doc(uid).set({
      uid,
      name,
      email,
      phone,
      role,
      createdAt: new Date().toISOString(),
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      status: "pending",
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message });
  }
}
