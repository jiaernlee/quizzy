"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { QuizSet as QuizSetInterface } from "../../../models/QuizSet";
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineEdit,
} from "react-icons/ai";
import AddQuestion from "../components/forms/AddQuestion";
import Swal from "sweetalert2";
import EditQuestion from "../components/forms/EditQuestion";
import Link from "next/link";
import { DotLoader } from "react-spinners";

interface QuestionDetails {
  idx: number;
  question: string;
  options: string[];
  answer: string[];
  type: string;
}

const CreateQuiz = () => {
  const searchParams = useSearchParams();
  const quizSetId = searchParams?.get("quizSetId") ?? null;
  const userRole = searchParams?.get("role") ?? null;
  const userId = searchParams?.get("id") ?? null;
  const [quizSet, setQuizSet] = useState<QuizSetInterface | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [details, setDetails] = useState({
    title: "",
    description: "",
  });
  const [detailsChanged, setDetailsChanged] = useState(false);
  const [question, setQuestion] = useState<QuestionDetails>({
    idx: 0,
    question: "",
    options: [],
    answer: [],
    type: "",
  });
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [orgId, setOrgId] = useState<string>("");
  const [newQuestion, setNewQuestion] = useState<object>();

  useEffect(() => {
    const fetchQuizSet = async () => {
      if (quizSetId) {
        try {
          const res = await fetch(
            `/api/organizations/getQuizById?quizId=${quizSetId}`
          );
          if (res.ok) {
            const data = await res.json();
            setQuizSet(data);
            setDetails({ title: data.title, description: data.description });
            setIsPublished(data.isPublished);
            if (userRole === "organization" && userId) {
              const orgRes = await fetch(
                `/api/organizations/getStudents/${userId}`
              );
              if (orgRes.ok) {
                const orgData = await orgRes.json();
                setOrgId(orgData.orgId);
                console.log(orgData.orgId);
              }
            }
          } else {
            console.error("Failed to fetch quiz set");
          }
        } catch (error) {
          console.error("Error fetching quiz set:", error);
        }
      }
    };
    fetchQuizSet();
  }, [quizSetId, newQuestion]);

  const handleCreateClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleEditModalClose = () => {
    setEditModal(false);
  };

  const handleEditClick = (
    idx: number,
    questionText: string,
    options: string[],
    answer: string[],
    type: string
  ) => {
    setQuestion({ idx, question: questionText, options, answer, type });
    setEditModal(true);
  };

  const handleSaveQuestion = async (
    question: string,
    options: object,
    answer: string[],
    type: string
  ) => {
    try {
      const response = await fetch("/api/organizations/save-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: quizSetId,
          question,
          options,
          answer,
          type,
        }),
      });

      if (response.ok) {
        const newQuestion = await response.json();
        setNewQuestion(newQuestion);
      } else {
        console.error("Failed to save question");
      }
    } catch (error) {
      console.error("Error saving question:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleEditQuestion = async (
    idx: number,
    question: string,
    options: string[],
    answer: string[],
    type: string
  ) => {
    try {
      const response = await fetch("/api/organizations/save-question", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: quizSetId,
          idx,
          question,
          options,
          answer,
          type,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Success",
          text: "Question updated successfully",
          timer: 2000,
          icon: "success",
        });
        setNewQuestion(data);
      } else {
        Swal.fire({
          title: "Error",
          text: data.message,
          timer: 2000,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error saving question:", error);
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred. Please try again.",
        timer: 2000,
        icon: "error",
      });
    } finally {
      setEditModal(false);
    }
  };

  const handleDeleteQuestion = async (idx: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F44336",
      cancelButtonColor: "#808080",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/organizations/save-question`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: quizSetId, idx }),
        });

        if (res.ok) {
          Swal.fire({
            title: "Deleted!",
            text: "The question has been deleted.",
            icon: "success",
          });
          setNewQuestion({});
        } else {
          console.error("Failed to delete question");
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSaveDetails = async () => {
    try {
      const res = await fetch(`/api/organizations/createQuizSet`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: quizSetId,
          title: details.title,
          description: details.description,
        }),
      });

      if (res.ok) {
        Swal.fire({
          title: "Saved!",
          text: "The quiz set has been updated.",
          icon: "success",
        });
      } else {
        console.error("Failed to save details :(");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePublish = async () => {
    try {
      const res = await fetch(`/api/organizations/publish`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: quizSetId,
          orgId: orgId,
        }),
      });

      if (res.ok) {
        Swal.fire({
          title: "Saved!",
          text: "The quiz set has been published.",
          icon: "success",
        });
        setIsPublished(true);
      } else {
        console.error("Failed to published ;=;");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const url = "/quizPage?quiz=" + quizSetId;

  if (!quizSet)
    return (
      <div className="flex flex-col justify-center items-center h-[90vh]">
        <DotLoader color="#ff01fb" />
      </div>
    );

  return (
    <main className="p-6 justify-center align-middle bg-white dark:bg-black h-full">
      <div className="my-5">
        <h1 className="dark:text-gray-300 mb-2 text-black">
          Title:{" "}
          <span className="font-bold text-2xl text-black">
            {userRole == "organization" &&
            quizSet.createdBy.toString() == userId ? (
              <input
                name="title"
                value={details.title}
                onChange={(e) => {
                  setDetails({ ...details, title: e.target.value });
                  setDetailsChanged(true);
                }}
                className="rounded-lg p-1 w-3/4 border border-black dark:border-none"
              />
            ) : (
              <span className="dark:text-white">{quizSet.title}</span>
            )}
          </span>
        </h1>
        <p className="text-black dark:text-white">
          <span className="dark:text-gray-300  text-black">Description:</span>{" "}
          {userRole == "organization" &&
          quizSet.createdBy.toString() == userId ? (
            <input
              name="description"
              value={details.description}
              onChange={(e) => {
                setDetails({ ...details, description: e.target.value });
                setDetailsChanged(true);
              }}
              className="text-black rounded-lg p-2 border border-black dark:border-none"
            />
          ) : (
            quizSet.description
          )}
        </p>
        {userRole == "organization" &&
        quizSet.createdBy.toString() == userId ? (
          <p className="dark:text-white">
            <span className="dark:text-gray-300">Code:</span> {quizSet.code}
          </p>
        ) : (
          ""
        )}
      </div>
      {userRole == "organization" && quizSet.createdBy.toString() == userId ? (
        detailsChanged ? (
          <button className="bg-[#02a9ea] p-2 mb-3" onClick={handleSaveDetails}>
            Save
          </button>
        ) : (
          <button
            disabled
            className="disabled:opacity-75 bg-[#02a9ea] p-2 mb-3"
          >
            Save
          </button>
        )
      ) : (
        <Link href={url}>
          <button className="border border-[#02a9ea] p-2 mb-3 transition duration-500 hover:scale-105 dark:bg-transparent bg-[#02a9ea] text-white">
            Start quiz
          </button>
        </Link>
      )}

      <hr />
      <div className="w-100 py-4">
        {userRole == "organization" &&
        quizSet.createdBy.toString() == userId ? (
          <button
            className="border text-white border-[#02a9ea] ms-2 p-2 text-sm hover:bg-[#02a9ea] dark:bg-transparent bg-[#02a9ea] my-3"
            onClick={handleCreateClick}
          >
            Add Question
          </button>
        ) : (
          ""
        )}

        <div className="my-5">
          {quizSet.questions.map((question, i) => {
            return (
              <div className="card md:flex gap-5 mb-3" key={i}>
                <h1 className="font-bold text-3xl text-white">{i + 1}</h1>
                <div className="justify-center md:justify-start gap-3">
                  <h5 className="font-bold mb-3">{question.question}</h5>
                  <ul className="flex flex-col md:flex-row gap-3 my-3 md:my-0">
                    {question.options.map((option, i) => {
                      let isCorrect = false;
                      question.answer.forEach((ans) => {
                        if (option === ans) {
                          isCorrect = true;
                          return;
                        }
                      });
                      return (
                        <li
                          className="flex  dark:text-gray-300 text-white text-sm"
                          key={i}
                        >
                          {userRole == "organization" &&
                          quizSet.createdBy.toString() == userId ? (
                            <div className="p-1 justify-center align-middle">
                              {isCorrect ? (
                                <p className="text-[#4CAF50]">
                                  <AiOutlineCheckCircle />
                                </p>
                              ) : (
                                <p className="text-[#F44336]">
                                  <AiOutlineCloseCircle />
                                </p>
                              )}
                            </div>
                          ) : (
                            ""
                          )}
                          {i + 1}. {option}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {userRole == "organization" &&
                quizSet.createdBy.toString() == userId ? (
                  <div className="ms-auto gap-3">
                    <button
                      className="text-[#4CAF50] p-2 text-2xl"
                      onClick={() =>
                        handleEditClick(
                          i,
                          question.question,
                          question.options,
                          question.answer,
                          question.type
                        )
                      }
                    >
                      <AiOutlineEdit />
                    </button>
                    <button
                      className="text-[#F44336] p-2 text-2xl "
                      onClick={() => handleDeleteQuestion(i)}
                    >
                      <AiOutlineCloseCircle />
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
        {userRole == "organization" &&
        quizSet.createdBy.toString() == userId ? (
          isPublished ? (
            <button
              disabled
              className="disabled:opacity-75 border border-[#02a9ea] dark:text-white ms-2 p-2 text-sm my-3"
            >
              Publish
            </button>
          ) : (
            <button
              className="border border-[#02a9ea] ms-2 p-2 text-sm hover:bg-[#02a9ea] my-3 dark:text-white"
              onClick={handlePublish}
            >
              Publish
            </button>
          )
        ) : (
          ""
        )}
      </div>
      <AddQuestion
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveQuestion}
      />
      <EditQuestion
        isOpen={editModal}
        onClose={handleEditModalClose}
        questionDetails={question}
        onSave={handleEditQuestion}
      />
    </main>
  );
};

export default CreateQuiz;
