"use client";

import { AiOutlineAim } from "react-icons/ai";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export const JoinWithCode = () => {
  const [code, setCode] = useState("");
  const router = useRouter();
  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && code.length === 5) {
      try {
        const response = await fetch(`/api/users/join?code=${code}`);
        if (response.ok) {
          const data = await response.json();
          router.push(`/quizPage?quiz=${data.quizSet._id}`);
        } else {
          console.log("No quiz set found with this code.");
          Swal.fire({
            title: "Oops",
            text: "No quiz set found with this code",
            timer: 3000,
            icon: "question",
          });
        }
      } catch (error) {
        console.error("Error fetching quiz set:", error);
      }
    }
  };

  return (
    <div className="relative flex flex-1">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        type="text"
        pattern="\d{5}"
        maxLength={5}
        className="peer block w-full rounded-md border border-[#ff01fb] py-[9px] pl-10 text-sm text-black"
        placeholder="Join by code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <AiOutlineAim className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#ff01fb]" />
    </div>
  );
};
