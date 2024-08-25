import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const { role, organizationId } = await req.json();
    const session = await auth();

    if (session && session.user?.email) {
      if (role) {
        const client = await clientPromise;
        const db = client.db("test");
        const usersCollection = db.collection("users");

        await usersCollection.updateOne(
          { email: session.user.email },
          { $set: { role, organization: organizationId, points: 0 } },
          { upsert: true }
        );

        await client.close();
        return NextResponse.json({
          message: "User role saved successfully",
          role: role,
        });
      } else {
        return NextResponse.json(
          { message: "Role is required" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
