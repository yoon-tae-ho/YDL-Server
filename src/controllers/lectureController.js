import Lecture from "../models/Lecture";
import Instructor from "../models/Instructor";
import Video from "../models/Video";
import Topic from "../models/Topic";

export const getLecturePreviews = async (req, res) => {
  try {
    const lectures = await Lecture.find({})
      .select(`${process.env.LECTURE_PREVIEW_FIELDS}`)
      .populate({
        path: "topics",
        select: "name",
      });
    return res.status(200).json(lectures);
  } catch (error) {
    console.log(error.message);
  }
};

export const getLectureDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const lecture = await Lecture.findById(id)
      .populate([
        { path: "instructors", select: "name" },
        { path: "topics", select: "name" },
        {
          path: "videos",
          select: [
            "title",
            "description",
            "thumbnailUrl",
            "embededCode",
            "player",
          ],
        },
      ])
      .lean();
    // error process
    if (!lecture) {
      return res.sendStatus(404);
    }
    return res.status(200).json(lecture);
  } catch (error) {
    console.log(error.message);
  }
};

export const getFirstVideo = async (req, res) => {
  const { id } = req.params;

  try {
    const lecture = await Lecture.findById(id, "_id")
      .populate({
        path: "videos",
        select: "_id",
        options: { limit: 1 },
      })
      .lean();

    if (!lecture) {
      return res.sendStatus(404);
    }

    return res.status(200).json(lecture.videos[0]);
  } catch (error) {
    console.log(error);
  }
};
