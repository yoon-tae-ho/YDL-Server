import Lecture from "../models/Lecture";
import Instructor from "../models/Instructor";
import Video from "../models/Video";
import Topic from "../models/Topic";

const MAX_BROWSE_LECTURES = 40;

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

    const result = await Promise.all(
      initialTopics.map((topic) =>
        Topic.findOne({ name: topic }).populate({
          path: "lectures",
          select: process.env.LECTURE_PREVIEW_FIELDS,
          options: { limit: MAX_BROWSE_LECTURES },
          populate: { path: "topics" },
        })
      )
    );

    // error process
    for (let i = 0; i < result.length; ++i) {
      if (!result[i]) {
        return res.sendStatus(404);
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getMore = async (req, res) => {
  const excepts = JSON.parse(req.headers.excepts);
  const TOPIC_NUM = 5;
  const result = [];
  try {
    let count = (await Topic.estimatedDocumentCount()) - excepts.length;
    let randomIndex = Math.floor(Math.random() * count);
    const ended = count <= TOPIC_NUM;

    for (let i = 0; i < (ended ? count + i : TOPIC_NUM); ++i) {
      const topic = await Topic.findOne({
        _id: { $nin: excepts },
      })
        .populate({
          path: "lectures",
          select: process.env.LECTURE_PREVIEW_FIELDS,
          options: { limit: MAX_BROWSE_LECTURES },
          populate: { path: "topics" },
        })
        .skip(randomIndex);

      // error process
      if (!topic) {
        return res.sendStatus(404);
      }

      excepts.push(topic._id);
      --count;
      randomIndex = Math.floor(Math.random() * count);
      result.push(topic);
    }

    return res.status(200).json({ result, ended });
  } catch (error) {
    console.log(error);
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