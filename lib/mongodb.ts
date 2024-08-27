import { MongoClient, MongoClientOptions } from "mongodb";

const uri: string | undefined = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Add Mongo URI to .env.local");
}

const options: MongoClientOptions = {};
const client = new MongoClient(uri, options);

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!(global as any)._mongoClientPromise) {
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export default clientPromise;
