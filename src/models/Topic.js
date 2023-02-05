import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    index: { type: Number, required: true, unique: true, index: true },
    test: { type: Boolean, default: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

topicSchema.virtual("lectures", {
  ref: "Lecture",
  localField: "_id",
  foreignField: "topics",
});

topicSchema.index({ name: "text" });

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;
