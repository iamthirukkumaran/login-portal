import { NextResponse } from "next/server";
import { dbconnect } from "@/lib/db/dbconnect";
import TeacherModel from "@/lib/model/TeacherModel";
import UserModel from "@/lib/model/UserModel";

export async function DELETE(req: Request, { params }: any) {
  try {
    await dbconnect();
    const resolvedParams = await params;

    const teacher = await TeacherModel.findById(resolvedParams.id);
    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "Teacher not found" },
        { status: 404 }
      );
    }

    // Delete user account also
    await UserModel.findByIdAndDelete(teacher.userId);

    // Delete teacher profile
    await TeacherModel.findByIdAndDelete(resolvedParams.id);

    return NextResponse.json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
