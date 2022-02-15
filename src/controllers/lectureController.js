import Lecture from "../models/Lecture";
import Instructor from "../models/Instructor";
import Video from "../models/Video";
import Topic from "../models/Topic";

export const getLecturePreviews = async (req, res) => {
  try {
    const lectures = await Lecture.find({})
      .select(["title", "thumbnailUrl", "topics"])
      .populate({
        path: "topics",
        select: "name",
      });
    return res.status(200).json(lectures);
  } catch (error) {
    console.log(error.message);
  }
};
