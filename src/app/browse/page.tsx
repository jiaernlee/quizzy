"use client";

import React, { useState, useEffect } from "react";
import { DotLoader } from "react-spinners";
import Link from "next/link";
import { AiOutlineFileSearch, AiOutlineTrophy } from "react-icons/ai";
import { useSession } from "next-auth/react";

export default function Browse() {
  useEffect(() => {
    const fetchAllQuizzes = async () => {
      try {
        const response = await fetch(`/api/users/getAllQuiz`);
        if (!response.ok) {
          console.error("Failed to fetch quizzes:", response.statusText);
          return;
        }
        const quizSets = await response.json();
        setAllQuizzes(quizSets);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllQuizzes();
  }, []);
  const [allQuizzes, setAllQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <DotLoader color="#ff01fb" />;
  }

  if (!session) {
    return <p className="dark:text-white">You are not logged in.</p>;
  }

  return (
    <div className="dark:text-white flex flex-col items-center ">
      <h1 className="dark:text-white text-2xl mt-24  mb-6 text-center">
        All Quizzes
      </h1>

      {loading ? (
        <DotLoader color="#ff01fb" />
      ) : allQuizzes.length > 0 ? (
        <div className="container grid-3 md:grid-6 flex justify-center items-center gap-3 px-24 pb-24">
          {allQuizzes.map((quiz) => (
            <div className="flex items-center" key={quiz._id}>
              <div className="transform scale-75 origin-top-left md:scale-100 bg-white hover:bg-gray-50 rounded-lg p-2 py-6 flex items-center cursor-pointer transition duration-500 hover:scale-105">
                <Link
                  href={`/quizSet?quizSetId=${quiz._id}&role=${session.user.role}&id=${session.user.id}`}
                >
                  <div className="flex">
                    <div className="border border-[#ff01fb] rounded-lg p-3">
                      <AiOutlineFileSearch className="text-[#ff01fb]" />
                    </div>
                    <div className="pl-4 px-5">
                      <p className="text-gray-800 font-bold">{quiz.title}</p>
                      <p className="text-gray-600 text-sm">
                        {quiz.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No quizzes available</p>
      )}
    </div>
  );
}
