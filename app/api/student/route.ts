import { NextResponse } from "next/server";
import { dbconnect } from "@/lib/db/dbconnect";
import StudentModel from "@/lib/model/StudentModel";
import { verifyToken } from "@/lib/auth/jwt";

export async function GET(req: Request) {
  try {
    await dbconnect();

    // Check if this is a request for current user's profile
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

    if (token) {
      try {
        const decoded: any = verifyToken(token);
        if (decoded && decoded.id) {
          
          // Get current student's profile
          let student = await StudentModel.findOne({ userId: decoded.id });
          
          if (student) {
            return NextResponse.json({
              success: true,
              student,
            });
          }
          
          // Fallback: try to find by email from decoded token
          if (decoded.email) {
            student = await StudentModel.findOne({ email: decoded.email });
            if (student) {
              return NextResponse.json({
                success: true,
                student,
              });
            }
          }
          
          // If no student profile found, return error
          return NextResponse.json(
            { success: false, message: "Student profile not found" },
            { status: 404 }
          );
        }
      } catch (err) {
        // Token verification failed
        return NextResponse.json(
          { success: false, message: "Invalid or expired token" },
          { status: 401 }
        );
      }
    }

    // No token provided - return error
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error fetching student profile", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbconnect();

    const body = await req.json();
    const { name, email, phone, gender, city, dob, group12, mark12 } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const student = await StudentModel.create({
      name,
      email,
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
