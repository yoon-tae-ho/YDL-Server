import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true },
  username: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  avatarUrl: { type: String },
  viewed: [
    {
      video: { type: mongoose.ObjectId, required: true, ref: "Video" },
      time: { type: String, required: true },
    },
  ],
  booked: [{ type: mongoose.ObjectId, ref: "Lecture" }],
  liked: [{ type: mongoose.ObjectId, ref: "Lecture" }],
  hated: [{ type: mongoose.ObjectId, ref: "Lecture" }],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(
      this.password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS)
    );
  }
});

const User = mongoose.model("User", userSchema);

export default User;
