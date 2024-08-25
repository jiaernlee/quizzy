import { handleSignOut } from "../actions/serverAction";

export default function SignOutBtn() {
  return (
    <form action={handleSignOut}>
      <button
        type="submit"
        className="w-full border border-[#ff01fb] font-semibold py-2 px-4 rounded transition duration-300 hover:dark:bg-[#ff01fb] bg-[#ff01fb] dark:bg-black hover:scale-105"
      >
        Sign Out
      </button>
    </form>
  );
}
