import mongoose, { Document, Schema } from "mongoose";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string[];
  type: "single" | "multiple";
}

export interface QuizSet extends Document {
  title: string;
  description?: string;
  questions: QuizQuestion[];
  createdBy: mongoose.Schema.Types.ObjectId;
  isPublished: Boolean;
  code: String;
  createdAt?: Date;
  updatedAt?: Date;
}

const QuestionSchema: Schema = new Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: [String], required: true },
  type: {
    type: String,
    enum: ["single", "multiple"],
    required: true,
  },
});

const QuizSetSchema = new Schema<QuizSet>(
  {
    title: { type: String, required: true },
    description: { type: String },
    questions: { type: [QuestionSchema], default: [] },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: { type: Boolean, default: false },
    code: { type: String },
  },
  {
    timestamps: true,
  }
);

const QuizSetModel =
  mongoose.models.QuizSet || mongoose.model<QuizSet>("QuizSet", QuizSetSchema);

export default QuizSetModel;
