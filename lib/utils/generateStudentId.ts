import StudentModel from "@/lib/model/StudentModel";

/**
 * Generate a unique 4-digit student ID (1000-9999)
 * Checks database to ensure uniqueness
 */
export async function generateUniqueStudentId(): Promise<string> {
  let studentId: string;
  let isUnique = false;

  while (!isUnique) {
    // Generate random 4-digit number (1000-9999)
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    studentId = randomNum.toString();

    // Check if ID already exists
    const existing = await StudentModel.findOne({ studentId });
    if (!existing) {
      isUnique = true;
    }
  }

  return studentId!;
}
