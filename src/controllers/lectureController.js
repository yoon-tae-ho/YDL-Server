import Lecture from "../models/Lecture";
import Instructor from "../models/Instructor";
import Video from "../models/Video";

export const getAllLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({})
      .populate("instructors")
      .populate("videos");
    return res.status(200).json(lectures);
  } catch (error) {
    console.log(error.message);
  }
};
