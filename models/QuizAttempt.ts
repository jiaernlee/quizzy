import mongoose, { Schema } from "mongoose";

interface QuizAttempt {
  student: mongoose.Schema.Types.ObjectId;
  quizSet: mongoose.Schema.Types.ObjectId;
  responses: { question: string; response: string[]; isCorrect: boolean }[];
  score: number;
}

const QuizAttemptSchema = new Schema<QuizAttempt>({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quizSet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuizSet",
    required: true,
  },
  responses: [
    {
      question: { type: String, required: true },
      response: { type: [String], required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
  score: { type: Number, default: 0 },
});

const QuizAttemptModel =
  mongoose.models.QuizAttempt ||
  mongoose.model<QuizAttempt>("QuizAttempt", QuizAttemptSchema);

export default QuizAttemptModel;
