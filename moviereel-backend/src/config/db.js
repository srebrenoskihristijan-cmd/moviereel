import mongoose from "mongoose";

/**
 * Connects to MongoDB.
 * - Locally (or in Docker) the local database is used.
 * - In the cloud (NODE_ENV=production) the production database (e.g. MongoDB
 *   Atlas) is used automatically via the MONGODB_URI environment variable.
 */
export const connectDB = async () => {
  const isProd = process.env.NODE_ENV === "production";
  const uri =
    process.env.MONGODB_URI ||
    (isProd ? null : "mongodb://127.0.0.1:27017/moviereel");

  if (!uri) {
    throw new Error("MONGODB_URI must be set in production (e.g. MongoDB Atlas).");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log(
    `MongoDB connected [${isProd ? "production" : "local"}]: ` +
      uri.replace(/\/\/[^@]*@/, "//***@")
  );
};
