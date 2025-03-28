import { MongoClient } from "mongodb";
import * as dotenv from 'dotenv';

dotenv.config();


export function run(collection:string) {
  const client = new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017");
  const database = client.db("workday");
  const currentCollection = database.collection(collection);
    
  return currentCollection
}

