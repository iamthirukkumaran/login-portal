import { NextResponse } from "next/server";
import { dbconnect } from "@/lib/db/dbconnect";
import StudentModel from "@/lib/model/StudentModel";
import UserModel from "@/lib/model/UserModel";
import { generateUniqueStudentId } from "@/lib/utils/generateStudentId";

export async function GET() {
  try {
    await dbconnect();
    const students = await StudentModel.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, students });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error fetching students", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbconnect();
    const body = await req.json();
    const { name, email, password, phone, gender, city, dob, group12, mark12 } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists in User collection
    const exists = await UserModel.findOne({ email: normalizedEmail });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 409 }
      );
    }

    // Create user
    const user = await UserModel.create({
      name,
      email: normalizedEmail,
      password, // hashed in model pre-save hook
      role: "student",
    });

    // Create student record
    const studentId = await generateUniqueStudentId();
    const student = await StudentModel.create({
      userId: user._id,
      studentId,
      name,
      email: normalizedEmail,
      phone,
      gender,
      city,
      dob,
      group12,
      mark12,
    });

    return NextResponse.json(
      { success: true, message: "Student created successfully", student },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error creating student", error: error.message },
      { status: 500 }
    );
  }
}
