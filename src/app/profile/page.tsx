import React, { Suspense } from "react";
import UserProfile from "../components/UserProfile";
import { DotLoader } from "react-spinners";

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col justify-center items-center h-[90vh]">
          <DotLoader color="#ff01fb" />
        </div>
      }
    >
      <UserProfile />
    </Suspense>
  );
}
