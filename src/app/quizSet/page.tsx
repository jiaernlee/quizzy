import { Suspense } from "react";
import CreateQuiz from "../components/CreateQuiz";
import { DotLoader } from "react-spinners";

const QuizSetPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col justify-center items-center h-[90vh]">
          <DotLoader color="#ff01fb" />
        </div>
      }
    >
      <CreateQuiz />
    </Suspense>
  );
};

export default QuizSetPage;
