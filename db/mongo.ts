import { MongoClient } from "mongodb";
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI="mongodb+srv://jeremiahbstafford:rVPNJG7ps34CmCCo@cluster0.2mc3w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"



export function run(collection:string) {
  const client = new MongoClient(MONGODB_URI);
  const database = client.db("workday");
  const currentCollection = database.collection(collection);
    
  return currentCollection
}

