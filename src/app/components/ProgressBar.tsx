import React from "react";

interface ProgressBarProps {
  correctAnswers: number;
  totalQuestions: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  correctAnswers,
  totalQuestions,
}) => {
  const accuracy = (correctAnswers / totalQuestions) * 100;

  return (
    <div className="flex gap-2 items-center mb-4">
      <div className="w-52 rounded-full h-3 border border-[#4CAF50]">
        <div
          className="bg-[#4CAF50] h-3 rounded-full"
          style={{ width: `${accuracy}%` }}
        ></div>
      </div>
      <p>{accuracy}%</p>
    </div>
  );
};

export default ProgressBar;
