import Image from "next/image";
import quizzy_home_light from "../../public/quizzy_home_light.gif";
import quizzy_home_dark from "../../public/quizzy_home.gif";
import SignInBtn from "./components/SignInBtn";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center dark:bg-black bg-white">
      <div className="block dark:hidden">
        <Image
          src={quizzy_home_light}
          alt="Quiz Logo Light"
          width={900}
          height={900}
          className="size-96"
        />
      </div>
      <div className="hidden dark:block">
        <Image
          src={quizzy_home_dark}
          alt="Quiz Logo Dark"
          width={900}
          height={900}
          className="size-96"
        />
      </div>
      {!session ? <SignInBtn /> : ""}
    </main>
  );
}
