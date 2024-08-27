import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../../../../lib/mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: { query: string } }
) {
  const { query } = params;

  if (!query) {
    return NextResponse.json(
      { error: "Invalid query parameter" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("test");
    const quizSetCollection = db.collection("quizsets");

    const regex = new RegExp(query, "i");

    const quizSets = await quizSetCollection
      .find({
        $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
        isPublished: true,
      })
      .project({ title: 1, description: 1, code: 1 })
      .toArray();

    return NextResponse.json({ message: "All results found", quizSets });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal Server Error", error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
