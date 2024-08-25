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
      return "User not found";
    }

    const orgId = user.organization;

    const students = await userCollection
      .find({ role: "student", organization: orgId })
      .toArray();

    if (!students) return "Students not found";

    return NextResponse.json(students);
  } catch (e) {
    console.error("Error", e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
