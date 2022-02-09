import mongoose from "mongoose";

const instructorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  lectures: [{ type: mongoose.ObjectId, required: true, ref: "Lecture" }],
});

const Instructor = mongoose.model("Instructor", instructorSchema);

export default Instructor;
