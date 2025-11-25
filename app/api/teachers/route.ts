import { NextResponse } from "next/server";
import { dbconnect } from "@/lib/db/dbconnect";
import TeacherModel from "@/lib/model/TeacherModel";
import UserModel from "@/lib/model/UserModel";

export async function GET() {
  try {
    await dbconnect();

    const teachers = await TeacherModel.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      teachers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error fetching teachers", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbconnect();

    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // CHECK USER EXIST
    const exists = await UserModel.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 409 }
      );
    }

    // CREATE USER LOGIN - let the pre-save hook handle hashing
    const user = await UserModel.create({
      name,
      email,
      password, // Will be hashed by pre-save hook
      role: "teacher",
    });

    // CREATE TEACHER RECORD
    const teacher = await TeacherModel.create({
      userId: user._id,
      name,
      email,
    });

    return NextResponse.json(
      { success: true, message: "Teacher created successfully", teacher },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error creating teacher", error: error.message },
      { status: 500 }
    );
  }
}
