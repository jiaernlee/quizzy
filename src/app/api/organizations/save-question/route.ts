import { NextRequest, NextResponse } from "next/server";
import QuizSetModel from "../../../../../models/QuizSet";
import { auth } from "@/auth";
import mongoose from "mongoose";
import clientPromise from "../../../../../lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { id, question, options, answer, type } = await req.json();
    const session = await auth();

    if (session && session.user?.email) {
      const client = await clientPromise;
      const db = client.db("test");
      const quizSetCollection = db.collection("quizsets");

      const questionObject = {
        question,
        options,
        answer,
        type,
      };

      const objectId = new mongoose.Types.ObjectId(id);

      const result = await quizSetCollection.updateOne(
        { _id: objectId },
        { $push: { questions: questionObject } as any },
        { upsert: true }
      );

      if (result.matchedCount === 0 && result.upsertedCount === 0) {
        return NextResponse.json(
          { message: "Quiz set not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Question saved successfully",
        result,
      });
    } else {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "Error in /api/organizations/save-question:",
        error.message
      );
      return NextResponse.json(
        { message: "Internal Server Error", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error:", error);
      return NextResponse.json(
        {
          message: "Internal Server Error",
          error: "An unknown error occurred",
        },
        { status: 500 }
      );
    }
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id, idx } = await req.json();
    const session = await auth();

    if (session && session.user?.email) {
      const client = await clientPromise;
      const db = client.db("test");
      const quizSetCollection = db.collection("quizsets");

      const objectId = new mongoose.Types.ObjectId(id);

      const quizSet = await quizSetCollection.findOne({ _id: objectId });

      if (!quizSet) {
        return NextResponse.json(
          { message: "Quiz set not found" },
          { status: 404 }
        );
      }

      if (idx < 0 || idx >= quizSet.questions.length) {
        return NextResponse.json(
          { message: "Invalid question index" },
          { status: 400 }
        );
      }

      const updatedQuestions = quizSet.questions.filter(
        (q: object, i: number) => i !== idx
      );

      const result = await quizSetCollection.updateOne(
        { _id: objectId },
        { $set: { questions: updatedQuestions } }
      );

      if (result.modifiedCount === 0) {
        return NextResponse.json(
          { message: "Question not found or Quiz set not updated" },
          { status: 404 }
        );
      }

      return NextResponse.json({ message: "Question deleted successfully" });
    } else {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, idx, question, options, answer, type } = await req.json();
    const session = await auth();

    if (session && session.user?.email) {
      const client = await clientPromise;
      const db = client.db("test");
      const quizSetCollection = db.collection("quizsets");

      const objectId = new mongoose.Types.ObjectId(id);

      const quizSet = await quizSetCollection.findOne({ _id: objectId });

      if (!quizSet) {
        return NextResponse.json(
          { message: "Quiz set not found" },
          { status: 404 }
        );
      }

      if (idx < 0 || idx >= quizSet.questions.length) {
        return NextResponse.json(
          { message: "Invalid question index" },
          { status: 400 }
        );
      }

      const updatedQuestions = quizSet.questions.map((q: any, i: number) =>
        i === idx ? { question, options, answer, type } : q
      );

      const result = await quizSetCollection.updateOne(
        { _id: objectId },
        { $set: { questions: updatedQuestions } }
      );

      if (result.modifiedCount === 0) {
        return NextResponse.json(
          { message: "Failed to update question" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: "Question updated successfully",
      });
    } else {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
