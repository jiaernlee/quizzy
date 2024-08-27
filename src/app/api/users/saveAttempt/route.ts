import { NextResponse, NextRequest } from "next/server";
import QuizAttemptModel from "../../../../../models/QuizAttempt";
import UserModel from "../../../../../models/User";
import { auth } from "@/auth";
import mongoose from "mongoose";
import QuizSetModel from "../../../../../models/QuizSet";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const { quizSetId, responses, score } = await req.json();
    console.log("Received data:", { quizSetId, responses, score });

    if (session && session.user?.email) {
      await mongoose.connect(process.env.MONGODB_URI!);

      if (!quizSetId || !responses || typeof score !== "number") {
        console.error("Invalid data:", { quizSetId, responses, score });
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
      }

      try {
        const newAttempt = await QuizAttemptModel.create({
          student: new ObjectId(session.user.id),
          quizSet: quizSetId,
          responses,
          score,
        });

        const user = await UserModel.findById(session.user.id);
        if (user) {
          user.points = (user.points || 0) + score;
          await user.save();
        }

        return NextResponse.json({
          message: "Quiz attempt and points saved",
          attempt: newAttempt,
          userPoints: user?.points,
        });
      } catch (e) {
        console.error("Database error:", e);
        return NextResponse.json(
          { error: "Failed to save quiz attempt" },
          { status: 500 }
        );
      }
    } else {
      console.error("Unauthorized access attempt.");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  } catch (e) {
    console.error("Server error:", e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await mongoose.disconnect();
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (session && session.user?.id) {
      await mongoose.connect(process.env.MONGODB_URI!);

      const quizAttempts = await QuizAttemptModel.find({
        student: session.user.id,
      }).populate("quizSet");

      const quizSetIds = Array.from(
        new Set(quizAttempts.map((attempt) => attempt.quizSet))
      );

      const quizSets = await QuizSetModel.find({ _id: { $in: quizSetIds } });

      return NextResponse.json({ quizSets });
    } else {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  } catch (e) {
    console.error("Server error:", e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await mongoose.disconnect();
  }
}
