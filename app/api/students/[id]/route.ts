import { NextResponse } from "next/server";
import { dbconnect } from "@/lib/db/dbconnect";
import StudentModel from "@/lib/model/StudentModel";
import UserModel from "@/lib/model/UserModel";

export async function GET(req: Request, { params }: any) {
  try {
    await dbconnect();
    const resolvedParams = await params;
    const student = await StudentModel.findById(resolvedParams.id);

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
    const resolvedParams = await params;

    // If marks data is being sent
    if (data.marks !== undefined) {
      const student = await StudentModel.findById(resolvedParams.id);
      if (!student) {
        return NextResponse.json(
          { success: false, message: "Student not found" },
          { status: 404 }
        );
      }

      // Transform marks data from frontend format to schema format
      let transformedMarks = data.marks;
      if (!Array.isArray(data.marks) && data.marks.subjects) {
        // Handle both old format (subjectName/mark) and new format (subject/marks)
        console.log("🔄 Processing marks data");
        const nonEmptySubjects = data.marks.subjects.filter(
          (s: any) => (s.subject || s.subjectName) && (s.subject || s.subjectName).trim() !== ""
        );

        console.log("📋 Non-empty subjects:", nonEmptySubjects.length);

        transformedMarks = {
          semester: data.marks.semester,
          subjects: nonEmptySubjects.map((s: any) => ({
            subject: (s.subject || s.subjectName).trim(),
            marks: Number(s.marks !== undefined ? s.marks : s.mark) || 0,
          })),
        };
      } else if (Array.isArray(data.marks)) {
        // If it's an array, transform each element
        transformedMarks = data.marks.map((mark: any) => {
          if (mark.subjects && mark.subjects[0]) {
            // Check if new format (subject/marks) or old format (subjectName/mark)
            const hasNewFormat = mark.subjects[0].subject !== undefined;
            const hasOldFormat = mark.subjects[0].subjectName !== undefined;
            
            if (hasNewFormat || hasOldFormat) {
              return {
                semester: mark.semester,
                subjects: mark.subjects
                  .filter(
                    (s: any) => (s.subject || s.subjectName) && (s.subject || s.subjectName).trim() !== ""
                  )
                  .map((s: any) => ({
                    subject: (s.subject || s.subjectName).trim(),
                    marks: Number(s.marks !== undefined ? s.marks : s.mark) || 0,
                  })),
              };
            }
          }
          // Already in correct format or empty
          return mark;
        });
      }

      // If marks is an array, replace the whole marks array (for delete operations)
      if (Array.isArray(transformedMarks)) {
        student.marks = transformedMarks;
      } else {
        // If marks is an object, append or update semester marks

        const existingIndex = student.marks?.findIndex(
          (m: any) => m.semester === transformedMarks.semester
        );

        if (existingIndex !== undefined && existingIndex >= 0) {
          // Update existing semester
          student.marks[existingIndex] = transformedMarks;
        } else {
          // Add new semester marks
          student.marks = student.marks || [];
          student.marks.push(transformedMarks);
        }
      }

      // Use findByIdAndUpdate to skip validation, then fetch fresh data
      const updated = await StudentModel.findByIdAndUpdate(
        resolvedParams.id,
        { marks: student.marks },
        { new: true, runValidators: false }
      );
      console.log(
        "✅ Save successful, marks count:",
        updated?.marks?.length || 0
      );

      return NextResponse.json({
        success: true,
        message: "Student updated successfully",
        student: updated,
      });
    }

    // Remove studentId from update data if present (it's immutable)
    const updateData = { ...data };
    delete updateData.studentId;
    delete updateData.marks;

    

    const updated = await StudentModel.findByIdAndUpdate(
      resolvedParams.id,
      updateData,
      {
        new: true,
        runValidators: false, // Skip validation to avoid studentId required error
      }
    );

    if (!updated) {
      console.error(
        "❌ Student not found during profile update:",
        resolvedParams.id
      );
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
    console.error("❌ PUT Error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    return NextResponse.json(
      { success: false, message: "Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: any) {
  try {
    await dbconnect();
    const resolvedParams = await params;

    const student = await StudentModel.findById(resolvedParams.id);
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    // DELETE STUDENT PROFILE
    await StudentModel.findByIdAndDelete(resolvedParams.id);

    // DELETE LOGIN USER ACCOUNT
    await UserModel.findByIdAndDelete(student.userId);

    return NextResponse.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting student",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
