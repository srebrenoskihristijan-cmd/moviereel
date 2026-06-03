import mongoose from "mongoose";

// Collection 3: Movies. DEPENDENT on Genre (genre is a required reference).
const movieSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true, 
      maxlength: 200 
    },
    year: { 
      type: Number, 
      required: true, 
      min: 1888, 
      max: 2100 
    },
    genre: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Genre", 
      required: true 
    },
    director: { 
      type: String, 
      required: true, 
      trim: true 
    },
    runtime: { 
      type: Number, 
      min: 1, 
      max: 600 
    },
    overview: { 
      type: String, 
      default: "", 
      maxlength: 2000 
    },
    accent: {
      type: String, 
      default: "#e0a93f",
      match: [/^#[0-9a-fA-F]{6}$/, "Accent must be a hex colour."],
    },

    // TMDB external reference
    tmdbId: { 
      type: Number, 
      default: null,
      unique: true,           // Good for preventing duplicates
      sparse: true            // Allows multiple nulls (important!)
    },

    posterUrl: { 
      type: String, 
      default: "" 
    },
    avgRating: { 
      type: Number, 
      default: 0, 
      min: 0, 
      max: 5 
    },
  },
  { 
    timestamps: true 
  }
);

// Optional: Add a helpful index for common queries
movieSchema.index({ title: "text", overview: "text" });

export default mongoose.model("Movie", movieSchema);