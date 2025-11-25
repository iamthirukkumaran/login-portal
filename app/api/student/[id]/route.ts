import { NextResponse } from "next/server";
import { dbconnect } from "@/lib/db/dbconnect";
import StudentModel from "@/lib/model/StudentModel";

export async function GET(req: Request, { params }: any) {
  try {
    await dbconnect();
    const student = await StudentModel.findById(params.id);

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, student });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: any) {
  try {
    await dbconnect();
    const data = await req.json();

    const updated = await StudentModel.findByIdAndUpdate(params.id, data, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Student updated successfully",
      student: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: any) {
  try {
    await dbconnect();

    const student = await StudentModel.findById(params.id);
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    await StudentModel.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error deleting student", error: error.message },
      { status: 500 }
    );
  }
}
