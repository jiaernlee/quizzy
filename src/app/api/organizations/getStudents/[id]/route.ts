import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db("test");
    const usersCollection = db.collection("users");

    const userObjectId = new ObjectId(id as string);

    const user = await usersCollection.findOne({ _id: userObjectId });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ orgId: user.organization });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
