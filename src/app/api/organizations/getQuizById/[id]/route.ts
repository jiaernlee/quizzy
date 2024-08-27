import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../../../lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db("test");
    const quizSetCollection = db.collection("quizsets");

    if (!id) {
      return NextResponse.json({ error: "Missing quiz id" }, { status: 400 });
    }

    const quizObjectId = new ObjectId(id);

    const quizSet = await quizSetCollection.findOne({ _id: quizObjectId });

    return NextResponse.json(quizSet);
  } catch (e) {
    console.error("Error fetching quiz set:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
