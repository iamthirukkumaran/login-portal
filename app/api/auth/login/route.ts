// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import UserModel from "@/lib/model/UserModel";
import { dbconnect } from "@/lib/db/dbconnect";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "@/lib/auth/jwt";
 
export async function POST(req: Request) {
  try {
    await dbconnect();

    const { email, password } = await req.json();

    // ------------------------------
    // VALIDATION
    // ------------------------------
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // ------------------------------
    // CHECK USER EXISTS
    // ------------------------------
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ------------------------------
    // COMPARE PASSWORD
    // ------------------------------
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ------------------------------
    // GENERATE JWT TOKEN
    // ------------------------------
    const token = generateAccessToken({
      id: user._id,
      role: user.role,
      email: user.email,
    });

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Set token in httpOnly cookie
    if (token) {
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });
    }

    return response;
  } catch (error: any) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
