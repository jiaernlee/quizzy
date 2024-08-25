import { NextResponse, NextRequest } from "next/server";
import QuizSetModel from "../../../../../models/QuizSet";
import { auth } from "@/auth";
import mongoose from "mongoose";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

function generateRandomCode() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export async function POST(req: NextRequest) {
  try {
    const { title, description, createdBy } = await req.json();
    const session = await auth();
    const code = generateRandomCode();

    if (session && session.user?.email) {
      await mongoose.connect(process.env.MONGODB_URI!);

      const newQuizSet = new QuizSetModel({
        title,
        description,
        createdBy,
        code,
      });

      await newQuizSet.save();

      return NextResponse.json({
        message: "Quiz set saved successfully",
        id: newQuizSet._id.toString(),
      });
    } else {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await mongoose.disconnect();
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const session = await auth();

    if (session && session.user?.email) {
      const client = await clientPromise;
      const db = client.db("test");
      const quizSetCollection = db.collection("quizsets");

      const objectId = new mongoose.Types.ObjectId(id);

      const result = await quizSetCollection.findOneAndDelete({
        _id: objectId,
      });

      if (!result) {
        return NextResponse.json({ message: "Error deleting quiz set" });
      }

      const updatedQuizSets = await quizSetCollection.find().toArray();

      return NextResponse.json({
        message: "Quiz set deleted successfully",
        updatedQuizSets,
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

export async function PUT(req: NextRequest) {
  try {
    const { id, title, description } = await req.json();
    const session = await auth();

    if (session && session.user?.email) {
      const client = await clientPromise;
      const db = client.db("test");
      const quizSetCollection = db.collection("quizsets");

      const objectId = new ObjectId(id);

      const result = await quizSetCollection.findOneAndUpdate(
        { _id: objectId },
        {
          $set: {
            title: title,
            description: description,
          },
        },
        { returnDocument: "after" }
      );

      if (!result) return NextResponse.json({ message: "Quiz set not found" });

      return NextResponse.json({
        message: "Quiz set updated successfully",
        quizSet: result.value,
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
