import Instructor from "../models/Instructor";
import Lecture from "../models/Lecture";
import Topic from "../models/Topic";

export const searchLectures = async (req, res) => {
  const { text } = req.params;
  const excepts = JSON.parse(req.headers.excepts);
  if (!text) {
    return res.sendStatus(400);
  }

  const MAX_LECTURES = 40;
  let ended = false;

  const extractLectures = (documents, maxLength) => {
    const result = [];

    for (let i = 0; i < documents.length; ++i) {
      let isEnded = false;
      for (let j = 0; j < documents[i].lectures.length; ++j) {
        const index = result.findIndex(
          (lecture) =>
            String(lecture._id) === String(documents[i].lectures[j]._id)
        );

        if (index === -1) {
          result.push(documents[i].lectures[j]);
          // Add new queried lectures to excepts
          excepts.push(documents[i].lectures[j]._id);
        }

        if (result.length >= maxLength) {
          isEnded = true;
          break;
        }
      }
      if (isEnded) {
        break;
      }
    }

    return result;
  };

  try {
    // 1. title, institute
    let lectures = await Lecture.find(
      { $and: [{ $text: { $search: text } }, { _id: { $nin: excepts } }] },
      process.env.LECTURE_PREVIEW_FIELDS,
      {
        limit: MAX_LECTURES + 1,
        score: { $meta: "textScore" },
      }
    )
      .sort({ score: { $meta: "textScore" } })
      .lean();

    // Add new queried lectures to excepts
    lectures.forEach((lecture) => excepts.push(String(lecture._id)));

    // 2. topic
    if (lectures.length < MAX_LECTURES + 1) {
      const limit = MAX_LECTURES + 1 - lectures.length;

      const topics = await Topic.find(
        { $text: { $search: text } },
        "lectures",
        {
          score: { $meta: "textScore" },
        }
      )
        .populate({
          path: "lectures",
          match: { _id: { $nin: excepts } },
          select: process.env.LECTURE_PREVIEW_FIELDS,
          options: { limit },
        })
        .sort({ score: { $meta: "textScore" } })
        .lean();

      if (topics.length !== 0) {
        const newLectures = extractLectures(topics, limit);
        lectures = [...lectures, ...newLectures];
      }
    }

    // 3. instructor
    if (lectures.length < MAX_LECTURES + 1) {
      const limit = MAX_LECTURES + 1 - lectures.length;

      const instructors = await Instructor.find(
        { $text: { $search: text } },
        "lectures",
        { score: { $meta: "textScore" } }
      )
        .populate({
          path: "lectures",
          match: { _id: { $nin: excepts } },
          select: process.env.LECTURE_PREVIEW_FIELDS,
          options: { limit },
        })
        .sort({ score: { $meta: "textScore" } })
        .lean();

      if (instructors.length !== 0) {
        const newLectures = extractLectures(instructors, limit);
        lectures = [...lectures, ...newLectures];
      }
    }

    // error process
    if (!lectures || lectures.length === 0) {
      return res.sendStatus(404);
    }

    if (lectures.length > MAX_LECTURES) {
      // not ended
      lectures = lectures.slice(0, MAX_LECTURES);
    } else {
      // ended
      ended = true;
    }

    return res.status(200).json({ lectures, ended });
  } catch (error) {
    console.log(error);
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
