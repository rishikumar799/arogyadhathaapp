import { NextResponse } from "next/server";
import { adminDB } from "../../../lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Check in patients
    const userSnap = await adminDB
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!userSnap.empty) {
      const user = userSnap.docs[0].data();
      return NextResponse.json({
        success: true,
        status: "approved",
        role: user.role,
      });
    }

    // Check in requests
    const reqSnap = await adminDB
      .collection("requests")
      .where("email", "==", email)
      .get();

    if (!reqSnap.empty) {
      const reqUser = reqSnap.docs[0].data();
      return NextResponse.json({
        success: true,
        status: reqUser.status, // pending or approved
      });
    }

    return NextResponse.json({
      success: false,
      message: "User not found",
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message });
  }
}
