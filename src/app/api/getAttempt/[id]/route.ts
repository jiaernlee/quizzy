import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../../lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const quizAttemptCollection = db.collection("quizattempts");
    const usersCollection = db.collection("users");

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Missing quiz id" }, { status: 400 });
    }

    const quizObjectId = new ObjectId(id);

    const quizAttempts = await quizAttemptCollection
      .find({ quizSet: quizObjectId })
      .sort({ score: -1 })
      .toArray();

    const studentIds = quizAttempts.map((attempt: any) => attempt.student);
    const students = await usersCollection
      .find({ _id: { $in: studentIds } })
      .toArray();

    const studentMap = new Map(
      students.map((student: any) => [student._id.toString(), student])
    );

    const populatedQuizAttempts = quizAttempts.map((attempt: any) => ({
      ...attempt,
      student: studentMap.get(attempt.student.toString()) || null,
    }));

    return NextResponse.json(populatedQuizAttempts);
  } catch (e) {
    console.error("Error fetching quiz attempts:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
