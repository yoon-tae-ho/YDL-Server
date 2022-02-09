import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  instructors: [{ type: mongoose.ObjectId, required: true, ref: "Instructor" }],
  institute: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  topics: [{ type: String, trim: true }],
  courseId: { type: String, required: true },
  asTaughtIn: { type: String, required: true, trim: true },
  level: { type: String, trim: true },
  videos: [{ type: mongoose.ObjectId, required: true, ref: "Video" }],
  meta: {
    likes: { type: Number, required: true, default: 0 },
    hates: { type: Number, required: true, default: 0 },
  },
});

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;
