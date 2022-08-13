import Lecture from "../models/Lecture";
import Instructor from "../models/Instructor";
import Topic from "../models/Topic";

const MAX_BROWSE_LECTURES = 40;
const CONTINUE_WATCHING = "continue-watching";
const MY_LIST = "my-list";

export const browseTopics = async (req, res) => {
  const {
    headers: { new_indexes },
  } = req;
  const newIndexes = JSON.parse(new_indexes);

  try {
    const topics = await Topic.find({ index: newIndexes }).populate({
      path: "lectures",
      select: process.env.LECTURE_PREVIEW_FIELDS,
      options: { limit: MAX_BROWSE_LECTURES },
      populate: { path: "topics" },
    });

    return res.json({
      topics,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getInitial = async (req, res) => {
  const {
    session: { loggedIn, user },
  } = req;

  let username, viewed;
  if (user) {
    ({ username, viewed } = user);
  }

  try {
    const initialTopics = [
      "Computer Science",
      "Business",
      "Mathematics",
      "Economics",
      "Philosophy",
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

    if (loggedIn && viewed.length !== 0) {
      const viewedTopic = {
        _id: CONTINUE_WATCHING,
        name: `${username} 님이 시청중인 강의`,
        lectures: [],
      };

      viewedTopic.lectures = await Promise.all(
        viewed.map((aView) =>
          Lecture.findById(
            aView.lectureId,
            process.env.LECTURE_PREVIEW_FIELDS,
            {
              options: { limit: MAX_BROWSE_LECTURES },
            }
          )
            .populate("topics")
            .lean()
        )
      );

      result.splice(2, 0, viewedTopic);
    }

    // error process
    for (let i = 0; i < result.length; ++i) {
      if (!result[i]) {
        return res.sendStatus(404);
      }
    }

    const numOfTopics = await Topic.estimatedDocumentCount();

    return res.status(200).json({ topics: result, numOfTopics });
  } catch (error) {
    console.log(error);
  }
};

export const getLecturesOfTopic = async (req, res) => {
  const {
    params: { id },
    headers: { fetch_index },
    session: { loggedIn, user },
  } = req;

  const MAX_LECTURES = 40;
  let ended = false;

  const getLectures = async (lectureIdList) => {
    return await Promise.all(
      lectureIdList.map((element) =>
        Lecture.findById(element, process.env.LECTURE_PREVIEW_FIELDS, {
          options: { limit: MAX_BROWSE_LECTURES },
        })
          .populate("topics")
          .lean()
      )
    );
  };

  try {
    let topic = {};
    const start = MAX_LECTURES * fetch_index;
    const end = start + MAX_LECTURES + 1;
    switch (id) {
      case CONTINUE_WATCHING:
        if (!loggedIn) {
          return res.sendStatus(401);
        }

        topic = {
          _id: CONTINUE_WATCHING,
          name: `${user.username} 님이 시청중인 강의`,
          lectures: [],
        };

        const targetViewed = user.viewed.slice(start, end);

        topic.lectures = await getLectures(
          targetViewed.map((aView) => aView.lectureId)
        );
        break;

      case MY_LIST:
        if (!loggedIn) {
          return res.sendStatus(401);
        }

        topic = {
          _id: MY_LIST,
          name: `${user.username} 님이 찜한 강의`,
          lectures: [],
        };

        const targetBooked = user.booked.slice(start, end);

        topic.lectures = await getLectures(targetBooked);
        break;

      default:
        topic = await Topic.findById(id).populate({
          path: "lectures",
          select: process.env.LECTURE_PREVIEW_FIELDS,
          options: {
            skip: start,
            limit: end - start,
          },
          populate: { path: "topics" },
        });
        break;
    }

    // error process
    if (!topic || topic.lectures.length === 0) {
      return res.sendStatus(404);
    }

    if (topic.lectures.length === MAX_LECTURES + 1) {
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

export const getCategory = async (req, res) => {
  try {
    const topics = await Topic.find({}, "_id name").lean();
    return res.json(topics);
  } catch (error) {
    console.log(error);
  }
};
