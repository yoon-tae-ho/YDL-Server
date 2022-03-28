import Lecture from "../models/Lecture";

export const searchLectures = async (req, res) => {
  const {
    params: { text },
    headers: { fetch_index },
  } = req;
  if (!text) {
    return res.sendStatus(400);
  }

  const MAX_LECTURES = 40;
  let ended = false;

  try {
    const regex = new RegExp(text, "i");
    const config = [{ title: regex }, { institute: regex }];

    let lectures = await Lecture.find(
      { $or: config },
      process.env.LECTURE_PREVIEW_FIELDS,
      {
        skip: MAX_LECTURES * fetch_index,
        limit: MAX_LECTURES + 1,
      }
    )
      .populate("topics")
      .lean();

    // error process
    if (!lectures || lectures.length === 0) {
      return res.sendStatus(404);
    }

    if (lectures.length === MAX_LECTURES + 1) {
      // not ended
      lectures = lectures.slice(0, -1);
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
