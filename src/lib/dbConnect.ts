import { console } from "inspector";
import mongoose from "mongoose";

type ConnectionObjext = {
  isConnected?: number;
};

const MONGO_URI = process.env.MONGO_URI as string | "";
console.log("MONGO_URI : ", MONGO_URI);

const connection: ConnectionObjext = {};
export async function dbConnnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to databse");
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URI);
    connection.isConnected = db.connections[0].readyState;
    console.log("Databse connected successfully!");
    console.log(db);
  } catch (error) {
    console.log("Database connection failed :", error);
    process.exit(1);
  }
}
