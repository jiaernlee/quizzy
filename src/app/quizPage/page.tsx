import React, { Suspense } from "react";
import QuizPageContent from "../components/QuizPageContent";
import { DotLoader } from "react-spinners";

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col justify-center items-center h-[90vh]">
          <DotLoader color="#ff01fb" />
        </div>
      }
    >
      <QuizPageContent />
    </Suspense>
  );
}
