import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { seedDatabase } from "./utils/seed.js";

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  if (process.env.SEED_ON_START === "true") {
    const summary = await seedDatabase({ force: false });
    if (!summary.skipped) console.log("Seeded initial data:", summary);
  }
  app.listen(PORT, () => {
    console.log(`MovieReel API  ->  http://localhost:${PORT}`);
    console.log(`Swagger UI     ->  http://localhost:${PORT}/api/docs`);
    console.log(`DB helper page ->  http://localhost:${PORT}/db`);
  });
};

start().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
