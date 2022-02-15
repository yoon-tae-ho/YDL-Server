import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  belongIn: { type: mongoose.ObjectId, required: true, ref: "Lecture" },
  title: { type: String, required: true, trim: true },
  description: { type: String },
  thumbnailUrl: { type: String, required: true },
  embededCode: { type: String },
  videoLink: { type: String },
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
