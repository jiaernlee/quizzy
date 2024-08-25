import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const quizSetCollection = db.collection("quizsets");

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const userObjectId = new ObjectId(userId);

    const quizSets = await quizSetCollection
      .find({ createdBy: userObjectId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      quizSets.length > 0 ? quizSets : { message: "No quiz sets found" }
    );
  } catch (e) {
    console.error("Error fetching quiz sets:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
