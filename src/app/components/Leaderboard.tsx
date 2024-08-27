import { useEffect, useState } from "react";
import Image from "next/image";
import { AiOutlineTrophy } from "react-icons/ai";
import Swal from "sweetalert2";
import { DotLoader } from "react-spinners";

interface LeaderBoardProps {
  quizSetId: string;
  userId: string;
}

interface Attempt {
  student: {
    _id: string;
    name: string;
    image: string;
  };
  score: number;
}

const Leaderboard: React.FC<LeaderBoardProps> = ({ quizSetId, userId }) => {
  const [leaderboard, setLeaderboard] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuizSet = async () => {
      try {
        const res = await fetch(`/api/getAttempt?quizId=${quizSetId}`);
        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data);
        } else {
          console.log("error fetching quizset");
        }
      } catch (e) {
        Swal.fire({
          title: "Error",
          text: "Failed to get leaderboard",
          timer: 2000,
          icon: "error",
        });
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizSet();
  }, [quizSetId]);
  console.log(leaderboard);
  return (
    <div className="text-black w-full col-span-1 lg:h-[33vh] h-[23vh] m-auto p-4 border border-[#faff00] overflow-y-scroll rounded-lg">
      <h1 className="font-bold text-xl">Leaderboard</h1>

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <DotLoader color="#ff01fb" />
        </div>
      ) : (
        <ul>
          {leaderboard.map((attempt, i) => (
            <li
              key={i}
              className="bg-white hover:bg-gray-50 rounded-lg my-3 p-2 flex items-center cursor-pointer transition duration-500 hover:scale-105 gap-2"
            >
              {i + 1}.
              <Image
                src={attempt.student.image || "https://placehold.co/50x50"}
                height={30}
                width={30}
                alt="Student Profile"
                className="rounded-full ms-1"
              />
              <div className="px-4">
                <p className="text-gray-800 font-bold">
                  {userId
                    ? attempt.student._id == userId
                      ? "You"
                      : attempt.student.name
                    : attempt.student.name}
                </p>
                <p className="text-gray-800 text-sm">Score: {attempt.score}</p>
              </div>
              {i < 3 ? (
                <div>
                  <AiOutlineTrophy className="text-[#FFD700] text-3xl" />
                </div>
              ) : (
                ""
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Leaderboard;
