import { seedDatabase, wipeDatabase } from "../utils/seed.js";

// Used by the /db helper page.
export const reset = async (req, res, next) => {
  try {
    await wipeDatabase();
    res.json({ message: "All data deleted." });
  } catch (err) { next(err); }
};

export const seed = async (req, res, next) => {
  try {
    const summary = await seedDatabase({ force: true });
    res.json({ message: "Initial data inserted.", ...summary });
  } catch (err) { next(err); }
};
