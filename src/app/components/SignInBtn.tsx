import { signIn } from "@/auth";

export default function SignInBtn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/dashboard" });
      }}
    >
      <button
        type="submit"
        className="rounded-lg border mb-3 text-xl font-semibold px-5 py-4 bg-[#faff00]  dark:bg-neutral-800/30 border-[#faff00] transition duration-500 hover:scale-105 text-white"
      >
        Sign in with Google{" "}
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          -&gt;
        </span>
      </button>
    </form>
  );
}
