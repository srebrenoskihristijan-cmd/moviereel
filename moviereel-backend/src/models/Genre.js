import mongoose from "mongoose";

// Collection 2: Genres. Movies reference a genre (see Movie model).
const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: "" },
});

export default mongoose.model("Genre", genreSchema);
