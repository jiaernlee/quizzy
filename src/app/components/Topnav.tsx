import SignOutBtn from "./SignOutBtn";
import { auth } from "../../auth";
import Link from "next/link";
import { AiOutlineDashboard } from "react-icons/ai";
import Image from "next/image";

export default async function Topnav() {
  const session = await auth();
  return (
    <nav className="flex ps-3  pe-5 py-3 border-b-4 border-[#faff00] justify-between dark:bg-black bg-white text-black dark:text-white">
      <Link href="/">
        <small>Quizzy D: </small>
      </Link>
      <div className="flex justify-end gap-5">
        {session === null ? (
          ""
        ) : (
          <>
            <Link href="/dashboard">
              <div className="flex gap-1 text-sm items-center text-black dark:text-white">
                <div className="border border-[#ff01fb] dark:text-white p-1 rounded-lg text-black">
                  <AiOutlineDashboard size={20} />
                </div>
                Dashboard
              </div>
            </Link>

            <Link href={`/profile?userId=${session.user?.id}`}>
              <div className="flex gap-1 text-sm items-center text-black dark:text-white">
                <div className="border border-[#ff01fb] dark:text-white p-1 rounded-full text-black">
                  <Image
                    src={session.user?.image as string}
                    height={20}
                    width={20}
                    alt="PFP"
                    className="rounded-full"
                  />
                </div>
                {session.user?.name}
              </div>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
