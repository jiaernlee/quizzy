"use client";

import { AiOutlineAim } from "react-icons/ai";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
        }
      } catch (error) {
        console.error("Error fetching quiz set:", error);
      }
    }
  };

  return (
    <div className="relative flex flex-1 flex-shrink-0 w-full">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-100 rounded-md border border-[#ff01fb] py-[9px] pl-10 text-sm text-black"
        placeholder="Enter code and press 'Enter'"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <AiOutlineAim className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#ff01fb]" />
    </div>
  );
};
