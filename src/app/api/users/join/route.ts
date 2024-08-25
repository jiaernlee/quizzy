import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Invalid code parameter" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("test");
    const quizSetCollection = db.collection("quizsets");

    const quizSet = await quizSetCollection.findOne({
      code: code,
      isPublished: true,
    });

    if (!quizSet) {
      return NextResponse.json(
        { error: "Quiz set not found or not published" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Quiz set found", quizSet });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal Server Error", error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
