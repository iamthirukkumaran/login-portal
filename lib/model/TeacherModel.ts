import mongoose, { Schema } from "mongoose";

const TeacherSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    subject: { type: String, default: "" },
    department: { type: String, default: "" },
  },
  { timestamps: true }
);

const TeacherModel =
  mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);

export default TeacherModel;
