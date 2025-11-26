import { NextResponse, type NextRequest } from "next/server";
import { dbconnect } from "@/lib/db/dbconnect";
import StudentModel from "@/lib/model/StudentModel";

interface RouteParams {
  params: Promise<{
    email: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await dbconnect();
    const { email } = await params;
    const decodedEmail = decodeURIComponent(email);

    const student = await StudentModel.findOne({ email: decodedEmail });

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
