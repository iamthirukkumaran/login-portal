import { NextResponse } from "next/server";
import { dbconnect } from "@/lib/db/dbconnect";
import StudentModel from "@/lib/model/StudentModel";

export async function GET(req: Request, { params }: any) {
  try {
    await dbconnect();
    const resolvedParams = await params;
    const email = decodeURIComponent(resolvedParams.email);

    const student = await StudentModel.findOne({ email });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      student,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error fetching student", error: error.message },
      { status: 500 }
    );
  }
}
