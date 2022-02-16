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
        { path: "videos", select: ["title", "description", "thumbnailUrl"] },
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

export const getLecturesOfTopic = async (req, res) => {
  const { id } = req.params;
  try {
    const topic = await Topic.findById(id)
      .populate({
        path: "lectures",
        select: `${process.env.LECTURE_PREVIEW_FIELDS}`,
      })
      .lean();
    // error process
    if (!topic) {
      return res.sendStatus(404);
    }
    return res.status(200).json(topic);
  } catch (error) {
    console.log(error.message);
  }
};

export const getLecturesOfInstructors = async (req, res) => {
  const { id } = req.params;
  try {
    const instructor = await Instructor.findById(id).populate({
      path: "lectures",
      select: `${process.env.LECTURE_PREVIEW_FIELDS}`,
    });
    // error process
    if (!instructor) {
      return res.sendStatus(404);
    }
    return res.status(200).json(instructor);
  } catch (error) {
    console.log(error.message);
  }
};
