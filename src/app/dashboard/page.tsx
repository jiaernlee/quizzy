import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import clientPromise from "../../../lib/mongodb";
import { auth, signOut } from "@/auth";
import OrganizationDashboard from "../components/OrganizationDashboard";
import UserDashboard from "../components/UserDashboard";

export interface User {
  _id: string;
  email: string;
  role?: string;
  points?: number;
  organization?: string;
  name: string;
  image: string;
}

async function fetchUser(email: string | undefined): Promise<User | null> {
  if (!email) return null;
  const client = await clientPromise;
  const db = client.db("test");
  const userCollection = db.collection("users");
  const user = await userCollection.findOne({ email });

  if (user) {
    return {
      ...user,
      _id: user._id.toString(),
    } as User;
  }

  return null;
}

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    signOut({ redirectTo: "/" });
    return null;
  }

  const user = await fetchUser(session.user.email!);

  if (!user) {
    redirect("/");
    return null;
  }

  if (!session.user.role) {
    redirect("/choose-role");
    return null;
  }

  return (
    <main className="min-h-screen">
      {session.user.role === "organization" ? (
        <OrganizationDashboard user={session.user} />
      ) : (
        <UserDashboard user={session.user} />
      )}
    </main>
  );
}
