import { NextResponse } from "next/server";
import { dbconnect } from "@/lib/db/dbconnect";
import StudentModel from "@/lib/model/StudentModel";

export async function GET() {
  try {
    await dbconnect();

    const students = await StudentModel.find().select("name email marks");

    return NextResponse.json({
      success: true,
      students,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error fetching marks", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbconnect();

    const body = await req.json();
    const { studentId, semester, subjects } = body;

    if (!studentId || !semester || !subjects) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const student = await StudentModel.findById(studentId);
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    // Add marks to student
    student.marks.push({ semester, subjects });
    await student.save();

    return NextResponse.json(
      { success: true, message: "Marks added successfully", student },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error adding marks", error: error.message },
      { status: 500 }
    );
  }
}
