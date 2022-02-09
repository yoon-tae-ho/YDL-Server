import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  instructors: [{ type: mongoose.ObjectId, required: true, ref: "Instructor" }],
  institute: { type: String, required: true, trim: true },
  description: { type: String },
  thumbnailUrl: { type: String, required: true },
  embededCode: { type: String },
  videoLink: { type: String },
  belongIn: { type: mongoose.ObjectId, required: true, ref: "Lecture" },
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
