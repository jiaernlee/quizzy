import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const quizSetCollection = db.collection("quizsets");

    const quizSets = await quizSetCollection
      .find({ isPublished: true })
      .toArray();

    return NextResponse.json(quizSets);
  } catch (e) {
    console.error("Error fetching quiz sets:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
