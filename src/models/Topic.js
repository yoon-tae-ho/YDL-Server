import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
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

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;
