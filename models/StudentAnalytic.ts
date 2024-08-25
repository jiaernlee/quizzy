import mongoose, { Schema } from "mongoose";

interface StudentAnalytics {
  student: mongoose.Schema.Types.ObjectId;
  points: number;
  quizSetsTaken: number;
}

const StudentAnalyticsSchema = new Schema<StudentAnalytics>({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  points: { type: Number, default: 0 },
  quizSetsTaken: { type: Number, default: 0 },
});

const StudentAnalyticsModel =
  mongoose.models.StudentAnalytics ||
  mongoose.model<StudentAnalytics>("StudentAnalytics", StudentAnalyticsSchema);

export default StudentAnalyticsModel;
