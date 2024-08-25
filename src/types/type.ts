import { Session } from "next-auth";
import { MongoClient } from "mongodb";

export interface UserProfileProps {
  session: Session | null;
}

export interface GetServerSidePropsContext {
  req: {
    headers: {
      cookie: string;
    };
  };
  res: {
    setHeader: (name: string, value: string) => void;
  };
  query: any;
  params: any;
  resolvedUrl: string;
}

export type MongoDBClient = MongoClient;
