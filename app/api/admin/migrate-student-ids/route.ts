// import { NextResponse } from "next/server";
// import { dbconnect } from "@/lib/db/dbconnect";
// import StudentModel from "@/lib/model/StudentModel";
// import { generateUniqueStudentId } from "@/lib/utils/generateStudentId";

// export async function GET() {
//   try {
//     await dbconnect();

//     // Find all students without studentId
//     const studentsWithoutId = await StudentModel.find({ 
//       studentId: { $in: [null, "", undefined] }
//     }).lean();
    
//     if (studentsWithoutId.length === 0) {
//       return NextResponse.json({
//         success: true,
//         message: "No students need migration",
//         count: 0,
//       });
//     }

//     let updated = 0;
//     const results = [];

//     for (const student of studentsWithoutId) {
//       try {
//         const newId = await generateUniqueStudentId();
        
//         const updatedStudent = await StudentModel.findByIdAndUpdate(
//           student._id,
//           { studentId: newId },
//           { new: true }
//         );
        
//         updated++;
//         results.push({
//           name: student.name,
//           oldId: student._id,
//           newStudentId: newId,
//           success: true
//         });
//       } catch (error) {
//         results.push({
//           name: student.name,
//           success: false,
//           error: String(error)
//         });
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       message: `Migration complete: ${updated} students updated`,
//       count: updated,
//       results: results,
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, message: "Migration failed", error: error.message },
//       { status: 500 }
//     );
//   }
// }

