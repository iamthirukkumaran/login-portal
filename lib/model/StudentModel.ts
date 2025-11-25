import mongoose, { Schema } from "mongoose";
import { MarkSchema } from "./MarkSchema";

const StudentSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    studentId: {
      type: String,
      unique: true,
      required: true, // Example: generated 4-digit ID
    },

    // Personal details
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    gender: { type: String },
    city: { type: String },
    dob: { type: String },

    // 12th class details
    group12: { type: String },
    mark12: { type: Number },

    // Semester Marks
    marks: {
      type: [MarkSchema], // Array of semesters
      default: [],
    },

    // Custom Fee (editable by admin/teacher)
    customFee: { type: Number },
  },
  { timestamps: true }
);

const StudentModel =
  mongoose.models.Student || mongoose.model("Student", StudentSchema);

export default StudentModel;
