import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const collection = db.collection("quizattempts");

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || !mongoose.Types.ObjectId.isValid(userId as string)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    const result = await collection
      .aggregate([
        {
          $match: { student: new mongoose.Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: "quizsets",
            localField: "quizSet",
            foreignField: "_id",
            as: "quizSetDetails",
          },
        },
        {
          $unwind: "$quizSetDetails",
        },
        {
          $addFields: {
            correctPercentage: {
              $multiply: [
                {
                  $divide: [
                    {
                      $reduce: {
                        input: "$responses",
                        initialValue: 0,
                        in: {
                          $cond: [
                            { $eq: ["$$this.isCorrect", true] },
                            { $add: ["$$value", 1] },
                            "$$value",
                          ],
                        },
                      },
                    },
                    { $size: "$responses" },
                  ],
                },
                100,
              ],
            },
          },
        },
        {
          $group: {
            _id: {
              quizSetId: "$quizSet",
              quizSetTitle: "$quizSetDetails.title",
            },
            averageCorrectPercentage: { $avg: "$correctPercentage" },
            totalAttempts: { $sum: 1 },
          },
        },
        {
          $project: {
            quizSet: "$_id.quizSetTitle",
            averageCorrectPercentage: 1,
            totalAttempts: 1,
          },
        },
      ])
      .toArray();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error calculating average correct percentage:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
