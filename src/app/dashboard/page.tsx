import { redirect } from "next/navigation";
import clientPromise from "../../../lib/mongodb";
import { auth } from "@/auth";
import { Session } from "next-auth";
import OrganizationDashboard from "../components/OrganizationDashboard";
import { signOut } from "@/auth";
import UserDashboard from "../components/UserDashboard";

export default async function Dashboard() {
  await clientPromise;
  const session: Session | null = await auth();

  console.log("Session:", session);

  const user = session?.user;

  console.log(user);

  if (!user?.role) {
    redirect("/choose-role");
  }

  if (!session) {
    await signOut({ redirectTo: "/" });
    return <></>;
  }

  return (
    <main className="min-h-screen">
      {user?.role === "organization" ? (
        <OrganizationDashboard user={session?.user} />
      ) : (
        <UserDashboard user={session?.user} />
      )}
    </main>
  );
}
