import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const orgCollection = db.collection("organizations");

    const organizations = await orgCollection.find().toArray();
    const organizationNames = organizations.map((org) => ({
      id: org._id,
      name: org.name,
    }));

    return NextResponse.json(organizationNames);
  } catch (e) {
    console.error("Error", e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
