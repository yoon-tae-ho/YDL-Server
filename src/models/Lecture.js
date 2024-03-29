import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    instructors: [
      { type: mongoose.ObjectId, required: true, ref: "Instructor" },
    ],
    topics: [{ type: mongoose.ObjectId, ref: "Topic", trim: true }],
    asTaughtIn: { type: String, required: true, trim: true },
    institute: { type: String, required: true, trim: true },
    levels: [{ type: String, trim: true }],
    description: { type: String },
    thumbnailUrl: { type: String, required: true },
    meta: {
      likes: { type: Number, required: true, default: 0 },
      hates: { type: Number, required: true, default: 0 },
    },
    test: { type: Boolean, default: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

lectureSchema.virtual("videos", {
  ref: "Video",
  localField: "_id",
  foreignField: "belongIn",
});

lectureSchema.index({ title: "text", institute: "text" });

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;
