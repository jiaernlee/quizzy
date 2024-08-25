import { NextResponse } from "next/server";
import mongoose from "mongoose";
import QuizSetModel from "../../../../../models/QuizSet";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId || !mongoose.Types.ObjectId.isValid(userId as string)) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }

  try {
    await clientPromise;
    const client = await clientPromise;
    const db = client.db("test");
    const quizSetCollection = db.collection("quizsets");
    const quizAttemptCollection = db.collection("quizattempts");

    const results = await quizSetCollection
      .aggregate([
        {
          $match: {
            createdBy: new ObjectId(userId),
            isPublished: true,
          },
        },
        {
          $lookup: {
            from: "quizattempts",
            localField: "_id",
            foreignField: "quizSet",
            as: "attempts",
          },
        },
        {
          $unwind: {
            path: "$attempts",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            title: { $first: "$title" },
            code: { $first: "$code" },
            description: { $first: "$description" },
            numUniqueStudents: { $addToSet: "$attempts.student" },
          },
        },
        {
          $addFields: {
            numUniqueStudents: { $size: "$numUniqueStudents" },
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            code: 1,
            description: 1,
            numUniqueStudents: 1,
          },
        },
      ])
      .toArray();

    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
