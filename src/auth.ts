import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../lib/mongodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (user) {
        session.user.role = user.role;
        session.user.points = user.points;
        session.user.name = user.name;
        session.user.image = user.image;
        session.user.organization = user.organization;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.points = user.points;
        token.name = user.name;
        token.image = user.image;
        token.organization = user.organization;
      }
      return token;
    },
  },
});
