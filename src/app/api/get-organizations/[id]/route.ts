import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../../lib/mongodb";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db("test");
    const orgCollection = db.collection("organizations");

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid organization ID" },
        { status: 400 }
      );
    }

    const organization = await orgCollection.findOne({ _id: new ObjectId(id) });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(organization);
  } catch (e) {
    console.error("Error", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const orgCollection = db.collection("organizations");

    const { id } = params;
    const { name, description } = await req.json();

    const updatedOrg = await orgCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { name, description } },
      { returnDocument: "after" }
    );

    if (!updatedOrg) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ updatedOrg: updatedOrg.value });
  } catch (e: unknown) {
    console.error("Error updating organization:", e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
