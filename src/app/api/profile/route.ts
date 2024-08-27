import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const usersCollection = db.collection("users");

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing quiz id" }, { status: 400 });
    }

    const userObjectId = new ObjectId(userId);

    const user = await usersCollection.findOne({ _id: userObjectId });

    return NextResponse.json(user);
  } catch (e) {
    console.error("Error", e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const usersCollection = db.collection("users");
    const orgCollection = db.collection("organizations");
    const quizAttemptsCollection = db.collection("quizattempts");

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing quiz id" }, { status: 400 });
    }

    const userObjectId = new ObjectId(userId);

    const user = await usersCollection.findOne({ _id: userObjectId });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    let studentUpdates: any = [];

    if (user.role === "organization") {
      const orgId = new ObjectId(user.organization);
      const students = await usersCollection
        .find({ role: "student", organization: orgId })
        .toArray();

      if (students.length > 0) {
        studentUpdates = await Promise.all(
          students.map((student) =>
            usersCollection.updateOne(
              { _id: student._id },
              {
                $set: { role: "normal" },
                $unset: { organization: "" },
              }
            )
          )
        );
      }

      await orgCollection.deleteOne({ _id: orgId });
    } else if (user.role === "student" || user.role === "normal") {
      await quizAttemptsCollection.deleteMany({ student: userObjectId });
    }

    await usersCollection.deleteOne({ _id: userObjectId });

    return NextResponse.json({
      message: "User deleted successfully",
      studentUpdates: studentUpdates.length > 0 ? studentUpdates : undefined,
    });
  } catch (e) {
    console.error("Error", e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const usersCollection = db.collection("users");

    const { name, image } = await req.json();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    console.log(name, image);

    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const userObjectId = new ObjectId(userId);
    const updateData: { name?: string; image?: string } = {};

    if (name) updateData.name = name;
    if (image) updateData.image = image;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No data provided for update" },
        { status: 400 }
      );
    }

    const result = await usersCollection.findOneAndUpdate(
      { _id: userObjectId },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result?.value) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(result.value);
  } catch (e: unknown) {
    console.error("Error", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
