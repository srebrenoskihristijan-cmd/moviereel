import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Collection 1: Users. Passwords are hashed with bcryptjs before saving.
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String, required: true, unique: true, trim: true,
      minlength: 3, maxlength: 20,
      match: [/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscores."],
    },
    email: {
      type: String, required: true, unique: true, lowercase: true, trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address."],
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

// schema-level integrity: hash password whenever it changes
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

export default mongoose.model("User", userSchema);
