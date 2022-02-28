import Lecture from "../models/Lecture";
import Instructor from "../models/Instructor";
import Video from "../models/Video";
import Topic from "../models/Topic";

export const getInitial = async (req, res) => {
  try {
    const initialTopics = [
      "Architecture",
      "Architectural Design",
      "Urban Studies",
      "Sociology",
      "Community Development",
      // "statistic",
      // "computer science",
      // "artificial intelligence",
      // "economy",
      // "business",
    ];

    // Multiple level population doesnt work to virtuals.
    // So, to use lean(), i dont use populate() when populate topics of lecture
    let result = await Promise.all(
      initialTopics.map((topic) =>
        Topic.findOne({ name: topic })
          .populate({
            path: "lectures",
            select: process.env.LECTURE_PREVIEW_FIELDS,
          })
          .lean()
      )
    );

    await Promise.all(
      result.map((topic, i) =>
        Promise.all(
          topic.lectures.map(
            async (lecture, j) =>
              (result[i].lectures[j].topics = await Promise.all(
                lecture.topics.map((topicId) => Topic.findById(topicId).lean())
              ))
          )
        )
      )
    );

    // error process
    for (let i = 0; i < result.length; ++i) {
      if (result[i] === null) {
        return res.sendStatus(404);
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

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

export const getLecturesByTopicName = async (req, res) => {
  const { name } = req.params;

  try {
    const topic = await Topic.findOne({ name })
      .populate({
        path: "lectures",
        select: `${process.env.LECTURE_PREVIEW_FIELDS}`,
      })
      .lean();
    // error process
    if (!topic) {
      return res.sendStatus(404);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
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
