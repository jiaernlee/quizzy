import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const userCollection = db.collection("users");

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const userObjectId = new ObjectId(userId);
    const user = await userCollection.findOne({
      _id: userObjectId,
      role: "organization",
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const orgId = user.organization;
    const students = await userCollection
      .find({ role: "student", organization: orgId })
      .toArray();

    if (students.length === 0) {
      return NextResponse.json({ message: "No students found" });
    }

    return NextResponse.json(students);
  } catch (e) {
    console.error("Error", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
