import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true },
  username: { type: String, required: true, trim: true },
  social: { type: String, required: true },
  avatarUrl: { type: String },
  viewed: [
    {
      lectureId: { type: mongoose.ObjectId, required: true, ref: "Lecture" },
      videos: [
        {
          videoId: { type: mongoose.ObjectId, required: true },
          videoCode: { type: String, required: true }, // video embededCode
          videoIndex: { type: Number, required: true },
          player: { type: String, required: true },
          time: { type: Number, required: true },
          duration: { type: Number, required: true },
        },
      ],
    },
  ],
  booked: [{ type: mongoose.ObjectId, ref: "Lecture" }],
  liked: [{ type: mongoose.ObjectId, ref: "Lecture" }],
  hated: [{ type: mongoose.ObjectId, ref: "Lecture" }],
});

const User = mongoose.model("User", userSchema);

export default User;
