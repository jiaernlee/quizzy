"use client";

import { QuizCountdown } from "../components/Countdown";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AiOutlineClose, AiOutlineFire } from "react-icons/ai";
import { DotLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import ProgressBar from "../components/ProgressBar";
import Link from "next/link";

const QuizPage: React.FC = () => {
  const searchParams = useSearchParams();
  const quizSetId = searchParams?.get("quiz") ?? null;
  const [isStartClicked, setIsStartClicked] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [quizDetails, setQuizDetails] = useState({
    title: "",
    description: "",
  });
  const [questions, setQuestions] = useState<
    { question: string; options: string[]; answer: string[]; type: string }[]
  >([{ question: "", options: [], answer: [], type: "single" }]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [userResponses, setUserResponses] = useState<
    { question: string; response: string[]; isCorrect: boolean }[]
  >([]);
  const [points, setPoints] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizSet = async () => {
      if (quizSetId) {
        try {
          const res = await fetch(
            `/api/organizations/getQuizById?quizId=${quizSetId}`
          );
          if (res.ok) {
            const data = await res.json();
            setQuizDetails({
              title: data.title,
              description: data.description,
            });
            setQuestions(data.questions);
          } else {
            console.error("Failed to fetch quiz set");
          }
        } catch (error) {
          console.error("Error fetching quiz set:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchQuizSet();
  }, [quizSetId]);

  useEffect(() => {
    if (currentQuestionIdx >= questions.length) {
      handleSaveAttempt();
    }
  }, [currentQuestionIdx, questions.length]);

  const handleStartClick = () => {
    setIsStartClicked(true);
    setIsCountdownActive(true);
  };

  const handleCountdownComplete = () => {
    setTimeout(() => {
      setIsCountdownActive(false);
    }, 1000);
  };

  const handleOptionClick = (option: string) => {
    if (questions[currentQuestionIdx].type === "single") {
      handleSingleChoice(option);
    } else {
      handleMultipleChoice(option);
    }
  };

  const handleSingleChoice = (option: string) => {
    const isCorrect = option === questions[currentQuestionIdx].answer[0];
    setSelectedOptions([option]);
    setIsAnswerCorrect(isCorrect);

    setUserResponses((prev) => [
      ...prev,
      {
        question: questions[currentQuestionIdx].question,
        response: [option],
        isCorrect: isCorrect,
      },
    ]);

    if (isCorrect) {
      setPoints((points) => points + 10);
      setScore((score) => score + 1);
      toast.success(
        <div className="flex items-center">
          +10 <AiOutlineFire color="#FF5722" className="ms-2" />
        </div>
      );
    } else {
      toast.error("Oopsie");
    }

    setTimeout(() => {
      setSelectedOptions([]);
      setIsAnswerCorrect(null);
      setCurrentQuestionIdx((idx) => idx + 1);
    }, 2000);
  };

  const handleMultipleChoice = (option: string) => {
    let isCorrect = false;
    questions[currentQuestionIdx].answer.forEach((ans) => {
      if (ans === option) {
        isCorrect = true;
        return;
      }
    });
    setSelectedOptions((prev) => {
      const newSelection = prev.includes(option)
        ? prev.filter((opt) => opt !== option)
        : [...prev, option];
      return newSelection;
    });
  };

  const handleSubmitAnswers = () => {
    const correctAnswers = questions[currentQuestionIdx].answer;
    const selectedCorrectAnswers = selectedOptions.filter((opt) =>
      correctAnswers.includes(opt)
    );
    const totalPoints = selectedCorrectAnswers.length * 5;
    const allCorrectSelected =
      selectedCorrectAnswers.length === correctAnswers.length;

    setIsAnswerCorrect(allCorrectSelected);
    setPoints((points) => points + totalPoints);
    allCorrectSelected ? setScore((score) => score + 1) : "";

    if (allCorrectSelected) {
      toast.success(
        <div className="flex items-center">
          + {totalPoints} <AiOutlineFire color="#FF5722" className="ms-2" />
        </div>
      );
    } else {
      toast.error("Oopsie");
    }

    setUserResponses((prev) => [
      ...prev,
      {
        question: questions[currentQuestionIdx].question,
        response: selectedOptions,
        isCorrect: allCorrectSelected,
      },
    ]);

    setTimeout(() => {
      setSelectedOptions([]);
      setIsAnswerCorrect(null);
      setCurrentQuestionIdx((idx) => idx + 1);
    }, 2000);
  };

  const handleSaveAttempt = async () => {
    try {
      const res = await fetch("/api/users/saveAttempt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizSetId: quizSetId,
          responses: userResponses,
          score: points,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(data.error);
        Swal.fire({
          title: "Error",
          text: "Failed to save quiz attempt",
          timer: 2000,
          icon: "error",
        });
      }
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: "Failed to save quiz attempt",
        timer: 2000,
        icon: "error",
      });
      console.error("Error saving quiz attempt", e);
    }
  };

  const handleRestart = () => {
    setIsStartClicked(false);
    setIsCountdownActive(false);
    setCurrentQuestionIdx(0);
    setSelectedOptions([]);
    setIsAnswerCorrect(null);
    setUserResponses([]);
    setPoints(0);
    setScore(0);
  };

  const currentQuestion = questions[currentQuestionIdx];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[90vh]">
        <DotLoader color="#ff01fb" />
      </div>
    );
  }

  if (!quizDetails.title) {
    return (
      <div className="flex flex-col justify-center items-center h-[90vh]">
        <AiOutlineClose className="text-red-500 text-6xl mb-4" />
        <h2 className="text-white text-2xl">Quiz not found</h2>
      </div>
    );
  }

  return (
    <>
      <div>
        {!isStartClicked ? (
          <div className="flex flex-col justify-center items-center h-[90vh]">
            <h1 className="dark:text-white font-bold text-xl">
              {quizDetails.title}
            </h1>
            <p className="dark:text-white my-2">{quizDetails.description}</p>
            <button
              className="border border-[#faff00] hover:bg-[#ffd900] dark:bg-transparent bg-[#ffd900] text-white px-4 py-2 rounded transition duration-500 hover:scale-105"
              onClick={handleStartClick}
            >
              Start Quiz
            </button>
          </div>
        ) : (
          isCountdownActive && (
            <QuizCountdown onCountdownComplete={handleCountdownComplete} />
          )
        )}
        {!isCountdownActive && isStartClicked && currentQuestion && (
          <div className="flex flex-col justify-center items-center h-[90vh] p-2 relative">
            <div className="absolute top-4 left-4 dark:text-white font-bold">
              Question {currentQuestionIdx + 1}/{questions.length}
            </div>
            <h2 className="dark:text-white text-xl mb-4">
              Question {currentQuestionIdx + 1}
            </h2>
            <p className="dark:text-white mb-3">{currentQuestion.question}</p>
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option, i) =>
                currentQuestion.type === "single" ? (
                  <button
                    key={i}
                    onClick={() => handleOptionClick(option)}
                    className={`px-4 py-2 rounded transition duration-300 text-white ${
                      selectedOptions.includes(option)
                        ? isAnswerCorrect
                          ? "bg-[#4CAF50]"
                          : "bg-[#F44336]"
                        : "bg-gray-500"
                    } hover:scale-105 transition duration-500`}
                    disabled={
                      selectedOptions.length > 0 &&
                      currentQuestion.type === "single"
                    }
                  >
                    {option}
                  </button>
                ) : (
                  <button
                    key={i}
                    className={`px-4 py-2 rounded transition duration-300 text-white ${
                      selectedOptions.includes(option)
                        ? "bg-[#02a9ea]"
                        : "bg-gray-500"
                    } ${
                      isAnswerCorrect !== null
                        ? currentQuestion.type === "multiple" &&
                          currentQuestion.answer.includes(option)
                          ? "bg-[#4CAF50]"
                          : "bg-[#F44336]"
                        : ""
                    } hover:scale-105 transition duration-500`}
                    disabled={
                      selectedOptions.length > 0 &&
                      currentQuestion.type === "single"
                    }
                  >
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option)}
                      onChange={() => handleOptionClick(option)}
                      className="me-2"
                    />
                    {option}
                  </button>
                )
              )}
            </div>
            {currentQuestion.type === "multiple" && (
              <button
                onClick={handleSubmitAnswers}
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded transition duration-500 hover:bg-blue-700"
              >
                Submit Answers
              </button>
            )}
          </div>
        )}
        {!isCountdownActive &&
          isStartClicked &&
          currentQuestionIdx >= questions.length && (
            <div className="flex flex-col justify-center items-center h-[90vh]">
              <h2 className="text-3xl font-bold dark:text-white text-black">
                Quiz completed!
              </h2>
              <h6 className="flex items-center  dark:text-white text-black gap-2 my-3">
                + {points} <AiOutlineFire color="#FF5722" />
              </h6>
              <p className="text-white">
                You got{" "}
                <span className="font-bold">
                  {score}/{questions.length}
                </span>{" "}
                questions
              </p>
              <ProgressBar
                correctAnswers={score}
                totalQuestions={questions.length}
              />
              <button
                className="border border-[#ff01fb] hover:bg-[#ff01fb] text-white dark:bg-transparent bg-[#ff01fb] px-4 py-2 mb-2 rounded transition duration-500 hover:scale-105"
                onClick={handleRestart}
              >
                Play again
              </button>
              <Link href={"/dashboard"}>
                <button className="border  dark:text-white text-black border-[#faff00] hover:bg-[#ffd900] dark:bg-transparent bg-[#ffd900] px-4 py-2 rounded transition duration-500 hover:scale-105">
                  Find a new quiz
                </button>
              </Link>
            </div>
          )}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default QuizPage;
