"use client";

import React, { useEffect, useState } from "react";
import { User as NextAuthUser } from "next-auth";
import Search from "./Search";
import { JoinWithCode } from "./JoinWithCode";
import Image from "next/image";
import Avatar from "../../../public/avatar.svg";
import {
  AiOutlineFileSearch,
  AiOutlineFire,
  AiOutlineTrophy,
} from "react-icons/ai";
import UserChart from "./UserChart";
import Link from "next/link";
import Leaderboard from "./Leaderboard";
import { User } from "../dashboard/page";

interface UserDashboardProps {
  user: NextAuthUser;
}
interface Quiz {
  _id: string;
  title: string;
  description: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isPublished: boolean;
  questions: any[];
}

interface QuizStats {
  averageCorrectPercentage: number;
  quizSet: string;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  console.log(user.id, "from userdashboard");
  const [attempted, setAttempted] = useState<Quiz[]>([]);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [quizSetId, setQuizSetId] = useState<string>("");
  const [quizStats, setQuizStats] = useState<QuizStats[]>();

  useEffect(() => {
    const fetchAttemptedQuizSets = async () => {
      try {
        const res = await fetch("/api/users/saveAttempt", {
          method: "GET",
        });
        const data = await res.json();
        if (data) setAttempted(data.quizSets);
        if (!res.ok) console.log(data.error, "saveattempts");
      } catch (e) {
        console.error("error getting quiz attempts", e);
      }
    };
    const fetchQuizStats = async () => {
      try {
        const res = await fetch(`/api/users/getQuizStats?userId=${user.id}`);
        const data = await res.json();
        console.log(data);
        setQuizStats(data);
        if (!res.ok) console.log(data.error, "savequizstats");
      } catch (e) {
        console.error("error saving quiz attempt", e);
      }
    };

    fetchQuizStats();
    fetchAttemptedQuizSets();
  }, [user.id]);

  const openLeaderboard = (quizSetId: string) => {
    setIsLeaderboardOpen(true);
    setQuizSetId(quizSetId);
  };

  const closeLeaderboard = () => {
    setIsLeaderboardOpen(false);
    setQuizSetId("");
  };

  let data: any = [];

  if (quizStats) {
    quizStats?.forEach((stat) => {
      data = [
        ...data,
        { quizSet: stat.quizSet, average: stat.averageCorrectPercentage },
      ];
    });
  }

  return (
    <div className="dark:bg-[#000300] px-6 mx-auto bg-white">
      <header className="mb-6 md:flex p-6 justify-between text-black dark:text-white">
        <h1 className="text-3xl font-bold my-2 flex items-center">
          Dashboard <AiOutlineFire color="#FF5722" className="ms-2" />
        </h1>
        <div className="flex space-x-2">
          <Search placeholder="Search something ..." user={user} />
          <JoinWithCode />
        </div>
      </header>

      <div className="p-4 grid md:grid-cols-3 grid-cols-1 gap-4 mb-6">
        <div className="flex flex-col gap-6">
          <div className="w-full col-span-1 lg:h-[33vh] h-[23vh] m-auto p-4 border border-[#ff01fb] rounded-lg lg:flex relative dark:bg-transparent bg-[#ff01fb] text-white">
            <div>
              <h1 className="font-bold text-xl">Hi, {user.name}</h1>
              <p>
                Points:{" "}
                <span className="font-bold">
                  {(user.points as number) >= 0 ? user.points : "nothing"}
                </span>
              </p>
            </div>
            <div className="hidden lg:block absolute top-3 right-9">
              <div className="relative">
                <Image src={Avatar} height={200} width={200} alt="Avatar" />
                <Image
                  src={user.image as string}
                  height={100}
                  width={100}
                  alt="User profile"
                  className="rounded-full absolute top-1 right-[50px]"
                />
              </div>
            </div>
          </div>
          <div className="w-full col-span-1 lg:h-[33vh] h-[23vh] m-auto p-4 border border-[#faff00] rounded-lg dark:bg-transparent bg-[#faff00]">
            <h1 className="font-bold text-xl text-black dark:text-white">
              Play again
            </h1>
            <ul className="flex overflow-x-auto gap-2">
              {attempted.length > 0 ? (
                attempted.map((quiz) => {
                  return (
                    <li className="flex items-center" key={quiz._id}>
                      <div className="transform scale-75 origin-top-left md:scale-100 bg-white hover:bg-gray-50 rounded-lg my-3 p-2 py-6 flex items-center cursor-pointer transition duration-500 hover:scale-105">
                        <Link
                          href={`/quizSet?quizSetId=${quiz._id}&role=${user.role}&id=${user.id}`}
                        >
                          <div className="flex">
                            <div className="border border-[#ff01fb] rounded-lg p-3">
                              <AiOutlineFileSearch className="text-[#ff01fb]" />
                            </div>
                            <div className="pl-4 px-5">
                              <p className="text-gray-800 font-bold">
                                {quiz.title}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {quiz.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                        <button onClick={() => openLeaderboard(quiz._id)}>
                          <AiOutlineTrophy className="text-[#FFD700] text-3xl" />
                        </button>
                      </div>
                    </li>
                  );
                })
              ) : (
                <h3 className="dark:text-white">Nothing yet</h3>
              )}
            </ul>
          </div>
        </div>
        <UserChart data={data} />
        {isLeaderboardOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg">
              <Leaderboard quizSetId={quizSetId} userId={user.id as string} />
              <button
                onClick={closeLeaderboard}
                className="mt-4 px-4 py-2 border border-red-500 text-black hover:bg-red-500 hover:text-white  rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
