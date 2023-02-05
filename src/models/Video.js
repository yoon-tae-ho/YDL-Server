import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  belongIn: { type: mongoose.ObjectId, required: true, ref: "Lecture" },
  videoIndex: { type: Number, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String },
  thumbnailUrl: { type: String, required: true },
  player: { type: String, required: true },
  videoLink: { type: String },
  // player by player
  embededCode: { type: String }, // YouTube
  videoSrc: { type: String }, // Yale, Oxford
  videoType: { type: String }, // Yale
  trackSrc: { type: String }, // Yale
  trackKind: { type: String }, // Yale
  trackSrclang: { type: String }, // Yale
  test: { type: Boolean, default: true },
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
