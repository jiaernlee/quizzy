import NextAuth from "next-auth";
import { User as NextAuthUser } from "next-auth";
import { Session as NextAuthSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    points?: number;
    organization?: string;
  }

  interface Session {
    user: User & {
      role?: string;
      points?: number;
      organization?: string;
    };
  }
}
