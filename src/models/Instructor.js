import mongoose from "mongoose";

const instructorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

instructorSchema.virtual("lectures", {
  ref: "Lecture",
  localField: "_id",
  foreignField: "instructors",
});

const Instructor = mongoose.model("Instructor", instructorSchema);

export default Instructor;
