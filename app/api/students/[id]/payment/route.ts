import { NextResponse } from "next/server";
import { dbconnect } from "@/lib/db/dbconnect";
import StudentModel from "@/lib/model/StudentModel";

export async function POST(req: Request, { params }: any) {
  try {
    await dbconnect();
    const data = await req.json();
    const resolvedParams = await params;
    const studentId = resolvedParams.id;

    const { amount, paymentMethod, remarks, recordedBy } = data;

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid payment amount" },
        { status: 400 }
      );
    }

    // Fetch student
    const student = await StudentModel.findById(studentId);
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    const fullFees = student.customFee || 1000000;
    const currentTotalPaid = student.totalPaid || 0;
    const remainingBalance = Math.max(0, fullFees - currentTotalPaid);

    // Validate payment doesn't exceed remaining balance
    if (amount > remainingBalance) {
      return NextResponse.json(
        {
          success: false,
          message: `Payment amount cannot exceed remaining balance of ₹${remainingBalance}`,
        },
        { status: 400 }
      );
    }

    // Create payment record
    const paymentRecord = {
      amount,
      paidAt: new Date(),
      paymentMethod: paymentMethod || "Manual",
      remarks: remarks || undefined,
      recordedBy: recordedBy || "System",
    };

    // Update student
    const updatedStudent = await StudentModel.findByIdAndUpdate(
      studentId,
      {
        $push: { paymentHistory: paymentRecord },
        $inc: { totalPaid: amount },
      },
      { new: true, runValidators: false }
    );

    return NextResponse.json({
      success: true,
      message: "Payment recorded successfully",
      student: updatedStudent,
      payment: paymentRecord,
    });
  } catch (error: any) {
    console.error("Error recording payment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error recording payment",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
