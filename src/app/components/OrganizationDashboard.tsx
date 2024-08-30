"use client";

import React, { useEffect, useState, useRef } from "react";
import { User as NextAuthUser } from "next-auth";
import QuizParticipationChart from "./QuizParticipationChart";
import {
  AiOutlineCloseCircle,
  AiOutlineEdit,
  AiOutlineFileSearch,
  AiOutlineTrophy,
} from "react-icons/ai";
import Image from "next/image";
import QuizSetModal from "./forms/QuizSetModal";
import Link from "next/link";
import { QuizSet as QuizSetInterface } from "../../../models/QuizSet";
import Swal from "sweetalert2";
import { DotLoader } from "react-spinners";
import Leaderboard from "./Leaderboard";
import { FaUsers } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import EditOrganizationModal from "./forms/EditOrganization";

interface Student {
  name: string;
  points: number;
  image?: string;
}

interface QuizStats {
  title: string;
  numUniqueStudents: number;
}

interface OrganizationDashboardProps {
  user: NextAuthUser;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
}

const OrganizationDashboard: React.FC<OrganizationDashboardProps> = ({
  user,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [quizSets, setQuizSets] = useState<QuizSetInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizSetLoading, setQuizSetLoading] = useState(true);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [quizSetId, setQuizSetId] = useState<string>("");
  const [newQuizSet, setNewQuizSet] = useState<object>();
  const [quizStats, setQuizStats] = useState<QuizStats[]>();
  const [org, setOrg] = useState<Organization>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(
          `/api/organizations/getStudents?userId=${user.id}`
        );
        if (res.ok) {
          const data = await res.json();
          setStudents(data);
        } else {
          console.error("Failed to fetch students");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchQuizStats = async () => {
      try {
        const res = await fetch(
          `/api/organizations/getQuizStats?userId=${user.id}`
        );
        if (res.ok) {
          const data = await res.json();
          setQuizStats(data);
        }
      } catch (error) {
        console.error("Error fetching quiz statistics:", error);
      }
    };

    const fetchOrg = async () => {
      try {
        const res = await fetch(`/api/get-organizations/${user.organization}`);
        if (res.ok) {
          const data = await res.json();
          setOrg(data);
        } else {
          console.error("Failed to fetch organization");
        }
      } catch (error) {
        console.error("Error fetching organization:", error);
      }
    };

    fetchQuizStats();
    fetchStudents();
    fetchOrg();
  }, [user.id]);

  useEffect(() => {
    const fetchQuizSets = async () => {
      try {
        const res = await fetch(`/api/organizations/getAllQuizSets/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setQuizSets(data);
        } else {
          console.error("Failed to fetch quiz sets");
        }
      } catch (error) {
        console.error("Error fetching quiz sets:", error);
      } finally {
        setQuizSetLoading(false);
      }
    };

    fetchQuizSets();
  }, [user.id, newQuizSet]);

  const handleCreateClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const openLeaderboard = (quizSetId: string) => {
    setIsLeaderboardOpen(true);
    setQuizSetId(quizSetId);
  };

  const closeLeaderboard = () => {
    setIsLeaderboardOpen(false);
    setQuizSetId("");
  };

  const handleSaveQuizSet = async (title: string, description: string) => {
    try {
      const response = await fetch("/api/organizations/createQuizSet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, createdBy: user.id }),
      });

      if (response.ok) {
        const newQuizSet = await response.json();
        setNewQuizSet(newQuizSet);
      } else {
        console.error("Failed to save quiz set");
      }
    } catch (error) {
      console.error("Error saving quiz set:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const deleteQuizSetHandler = async (id: string) => {
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
        const res = await fetch(`/api/organizations/createQuizSet`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (res.ok) {
          Swal.fire({
            title: "Deleted!",
            text: "The quiz set has been deleted.",
            icon: "success",
          });
          const data = res.json();
          setNewQuizSet({});
        } else {
          console.error("Failed to delete question");
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveOrganization = async (name: string, description: string) => {
    try {
      const response = await fetch(
        `/api/get-organizations/${user.organization}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsEditModalOpen(false);
        Swal.fire({
          title: "Success!",
          text: "Updated successfully",
          timer: 2000,
          icon: "success",
        });
      } else {
        console.error("Failed to update organization");
        Swal.fire({
          title: "Error!",
          text: "Failed to update",
          timer: 2000,
          icon: "error",
        });
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating organization:", error);
    }
  };

  let data: any = [];

  quizStats?.forEach((stat) => {
    data = [...data, { quizSet: stat.title, count: stat.numUniqueStudents }];
  });

  return (
    <div className="dark:bg-[#000300] px-6 mx-auto">
      <header className="mb-6 d-flex p-6 justify-between  dark:text-white">
        <h1 className="text-3xl font-bold my-2 ">
          {user.name}&apos;s Dashboard
        </h1>
      </header>
      <div className="flex flex-col-reverse  lg:grid lg:grid-cols-5 gap-4 px-4 pb-4">
        <div className="border border-[#ff01fb] dark:bg-transparent bg-[#ff01fb] text-white lg:col-span-2 col-span-1 flex justify-between w-full p-4 rounded-lg">
          <div className="flex flex-col w-full pb-4">
            <p className="text-2xl font-bold">{quizSets.length || 0}</p>
            <p>Total number of QuizSets</p>
          </div>
          <p className="border-2 border-[#02a9ea] dark:bg-transparent bg-white flex justify-center items-center p-2 rounded-sm">
            <span className="text-3xl text-black  dark:text-white">
              <MdQuiz />
            </span>
          </p>
        </div>
        <div className="border border-[#ff01fb] dark:bg-transparent bg-[#ff01fb] text-white lg:col-span-2 col-span-1 flex justify-between w-full p-4 rounded-lg">
          <div className="flex flex-col w-full pb-4">
            <p className="text-2xl font-bold">{students.length || 0}</p>
            <p>Total number of Students</p>
          </div>
          <p className="border-2 border-[#02a9ea] dark:bg-transparent bg-white flex justify-center items-center p-2 rounded-sm">
            <span className="text-3xl text-black dark:text-white">
              <FaUsers />
            </span>
          </p>
        </div>
        <div className="border border-[#ff01fb] dark:bg-transparent bg-[#ff01fb] text-white flex justify-between w-full p-4 rounded-lg">
          <div className="flex flex-col w-full pb-4">
            <p className="text-2xl font-bold">{org?.name}</p>
            <p>{org?.description}</p>
          </div>
          <p className="border-2  border-[#02a9ea] dark:bg-transparent bg-white flex justify-center items-center p-2 rounded-sm">
            <span className="text-3xl text-green-500">
              <AiOutlineEdit onClick={handleEditClick} />
            </span>
          </p>
        </div>
      </div>
      <div className="p-4 grid md:grid-cols-3 grid-cols-1 gap-4 mb-6">
        <QuizParticipationChart data={data} />
        <div className="flex flex-col gap-6">
          <div className="w-full col-span-1 lg:h-[33vh] h-[23vh] m-auto p-4 border border-[#faff00] dark:bg-transparent bg-[#faff00] overflow-y-scroll rounded-lg">
            <h1 className="font-bold text-xl dark:text-white">
              Quiz Sets Created
              <button
                onClick={handleCreateClick}
                className="border border-[#02a9ea] ms-2 px-2 py-1 rounded-lg text-sm hover:bg-[#02a9ea] text-white dark:bg-transparent bg-[#02a9ea]"
              >
                Create
              </button>
            </h1>
            {quizSetLoading ? (
              <DotLoader color="#ff01fb" />
            ) : (
              <ul>
                {quizSets.length > 0 ? (
                  quizSets.map((quizSet: any, index) => {
                    return (
                      <li className="flex items-center gap-2" key={index}>
                        <div
                          key={index}
                          className="bg-white hover:bg-gray-50 rounded-lg my-3 p-2 flex items-center cursor-pointer transition duration-500 hover:scale-105"
                        >
                          <Link
                            href={`/quizSet?quizSetId=${quizSet._id}&role=${user.role}&id=${user.id}`}
                          >
                            <div className="flex">
                              <div className="border border-[#ff01fb] rounded-lg p-3 items-center flex">
                                <AiOutlineFileSearch className="text-[#ff01fb]" />
                              </div>
                              <div className="pl-4">
                                <p className="text-gray-800 font-bold">
                                  {quizSet.title}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  {quizSet.description}
                                </p>
                                <p className="text-gray-800 text-sm">
                                  Code: {quizSet.code}
                                </p>
                              </div>
                            </div>
                          </Link>
                          <div className="flex justify-center items-center gap-1 ms-4">
                            <button
                              onClick={() => deleteQuizSetHandler(quizSet._id)}
                            >
                              <AiOutlineCloseCircle className="text-[#F44336] text-3xl" />
                            </button>
                            <button
                              onClick={() => openLeaderboard(quizSet._id)}
                            >
                              <AiOutlineTrophy className="text-[#FFD700] text-3xl" />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <p className="dark:text-white">No quiz sets found</p>
                )}
              </ul>
            )}
          </div>
          {/* Students */}
          <div className="w-full col-span-1 lg:h-[33vh] h-[23vh] m-auto p-4 border border-[#faff00]  dark:bg-transparent bg-[#faff00] overflow-y-scroll rounded-lg">
            <h1 className="font-bold text-xl dark:text-white">Students</h1>
            {loading ? (
              <DotLoader color="#ff01fb" />
            ) : (
              <ul>
                {students.length > 0 ? (
                  students.map((student, index) => (
                    <li
                      key={index}
                      className="bg-white hover:bg-gray-50 rounded-lg my-3 p-2 flex items-center cursor-pointer transition duration-500 hover:scale-105"
                    >
                      <div className="border border-[#ff01fb] rounded-lg p-2">
                        <Image
                          src={student.image || "https://placehold.co/50x50"}
                          height={50}
                          width={50}
                          alt="Student Profile"
                          className="rounded-full"
                        />
                      </div>
                      <div className="pl-4">
                        <p className="text-gray-800 font-bold">
                          {student.name}
                        </p>
                        <p className="text-gray-800 text-sm">
                          Points: {student.points}
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="dark:text-white">No students found</p>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
      <QuizSetModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveQuizSet}
      />
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
      <EditOrganizationModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        organization={org as Organization}
        onSave={handleSaveOrganization}
      />
    </div>
  );
};

export default OrganizationDashboard;
