import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const { role, organizationId } = await req.json();
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("test");
    const usersCollection = db.collection("users");

    const updatedUser = await usersCollection.updateOne(
      { email: session.user.email },
      { $set: { role, organization: organizationId, points: 0 } },
      { upsert: true }
    );

    if (updatedUser.modifiedCount > 0 || updatedUser.upsertedCount > 0) {
      return NextResponse.json({ message: "User role saved successfully" });
    } else {
      return NextResponse.json(
        { message: "Failed to update user role" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
