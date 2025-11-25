import { Schema } from "mongoose";

export const SubjectSchema = new Schema({
  subject: { type: String, required: true },
  marks: { type: Number, required: true },
});

export const MarkSchema = new Schema({
  semester: { type: Number, required: true },
  subjects: [SubjectSchema],  // each sem has 6 subjects
});
