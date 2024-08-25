import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { auth } from "@/auth";
import OrganizationModel from "../../../../models/Organization";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json();

    await mongoose.connect(process.env.MONGODB_URI!);

    const result = new OrganizationModel({
      name,
      description,
    });

    await result.save();

    const orgId = result._id.toString();

    return NextResponse.json({
      message: "Organization saved successfully",
      id: orgId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
