import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import clientPromise from "../../../../../lib/mongodb";
import { sendMail } from "../../../../../lib/sendMail";
import { ObjectId } from "mongodb";

export async function PUT(req: NextRequest) {
  try {
    const { id, orgId } = await req.json();
    const session = await auth();

    if (session && session.user?.email) {
      const client = await clientPromise;
      const db = client.db("test");
      const quizSetCollection = db.collection("quizsets");

      const result = await quizSetCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            isPublished: true,
          },
        },
        { returnDocument: "after" }
      );

      const quizSet = await quizSetCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!result || !quizSet)
        return NextResponse.json({ message: "Quiz set not found" });

      await sendMail(orgId, quizSet.code);

      return NextResponse.json({
        message: "Quiz set published successfully",
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
