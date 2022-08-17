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
  embededCode: { type: String }, // YouTube Player
  videoSrc: { type: String }, // Yale Player
  videoType: { type: String }, // Yale Player
  trackSrc: { type: String }, // Yale Player
  trackKind: { type: String }, // Yale Player
  trackSrclang: { type: String }, // Yale Player
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
