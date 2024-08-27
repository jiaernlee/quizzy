import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import QuizAttemptModel from "../../../../models/QuizAttempt";
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";

export async function GET(request: Request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get("quizId");

    if (!quizId) {
      return NextResponse.json({ error: "Missing quiz id" }, { status: 400 });
    }

    const quizObjectId = new ObjectId(quizId);

    const quizAttempts = await QuizAttemptModel.find({ quizSet: quizObjectId })
      .populate("student")
      .sort({ score: -1 })
      .exec();

    return NextResponse.json(quizAttempts);
  } catch (e) {
    if (isDynamicServerError(e)) {
      throw e;
    }
    console.error("Error fetching quiz attempts:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await mongoose.disconnect();
  }
}
