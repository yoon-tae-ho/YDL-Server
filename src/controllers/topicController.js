import Lecture from "../models/Lecture";
import Instructor from "../models/Instructor";
import Video from "../models/Video";
import Topic from "../models/Topic";

const MAX_BROWSE_LECTURES = 40;

export const getInitial = async (req, res) => {
  try {
    const initialTopics = [
      "computerscience",
      "business",
      "mathematics",
      "finance",
      "publichealth",
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
  const MAX_TOPIC = 5;
  const result = [];
  try {
    let count = (await Topic.estimatedDocumentCount()) - excepts.length;
    let randomIndex = Math.floor(Math.random() * count);
    const ended = count <= MAX_TOPIC;

    for (let i = 0; i < (ended ? count + i : MAX_TOPIC); ++i) {
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
  const {
    params: { id },
    headers: { fetch_index },
  } = req;
  const MAX_LECTURES = 40;
  let ended = false;

  try {
    const topic = await Topic.findById(id).populate({
      path: "lectures",
      select: process.env.LECTURE_PREVIEW_FIELDS,
      options: { skip: MAX_LECTURES * fetch_index, limit: MAX_LECTURES + 1 },
      populate: { path: "topics" },
    });

    // error process
    if (!topic || topic.lectures.length === 0) {
      return res.sendStatus(404);
    }

    const count = topic.lectures.length;
    if (count === MAX_LECTURES + 1) {
      // not ended
      topic.lectures = topic.lectures.slice(0, -1);
    } else {
      // ended
      ended = true;
    }

    return res.status(200).json({ topic, ended });
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
  const {
    params: { id },
    headers: { fetch_index },
  } = req;
  const MAX_LECTURES = 40;
  let ended = false;

  try {
    const instructor = await Instructor.findById(id).populate({
      path: "lectures",
      select: process.env.LECTURE_PREVIEW_FIELDS,
      options: { skip: MAX_LECTURES * fetch_index, limit: MAX_LECTURES + 1 },
      populate: { path: "topics" },
    });

    // error process
    if (!instructor || instructor.lectures.length === 0) {
      return res.sendStatus(404);
    }

    const count = instructor.lectures.length;
    if (count === MAX_LECTURES + 1) {
      // not ended
      instructor.lectures = instructor.lectures.slice(0, -1);
    } else {
      // ended
      ended = true;
    }

    return res.status(200).json({ instructor, ended });
  } catch (error) {
    console.log(error.message);
  }
};
