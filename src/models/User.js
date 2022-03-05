import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true },
  username: { type: String, required: true, trim: true },
  social: { type: String, required: true },
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

const User = mongoose.model("User", userSchema);

export default User;
