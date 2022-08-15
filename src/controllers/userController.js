import Lecture from "../models/Lecture";
import User from "../models/User";
import Video from "../models/Video";
import {
  startGithubLogin,
  finishGithubLogin,
  startKakaoLogin,
  finishKakaoLogin,
  startNaverLogin,
  finishNaverLogin,
  startGoogleLogin,
  finishGoogleLogin,
} from "./socialController";

export const getUser = (req, res) => {
  const { loggedIn, user } = req.session;

  let result;
  if (!loggedIn) {
    result = { loggedIn: false };
  } else {
    result = { loggedIn: true, user };
  }

  return res.status(200).json(result);
};

export const putUser = (req, res) => {};
export const deleteUser = (req, res) => {};

export const getViewed = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const video = await Video.findById(id, "embededCode player").lean();

    // error process
    if (!video) {
      return res.sendStatus(404);
    }

    return res.status(200).json(video);
  } catch (error) {
    console.log(error);
  }
};

export const putViewed = async (req, res) => {
  const {
    params: { id },
    body: { time, duration },
    session: {
      user: { _id, viewed },
    },
  } = req;

  try {
    const videoObj = await Video.findById(
      id,
      "belongIn embededCode videoIndex title player"
    ).lean();

    // this video does not exist.
    if (!videoObj) {
      return res.sendStatus(404);
    }

    let index;
    let lectureIndex = -1;
    let aView = viewed.find((aView, i) => {
      if (String(aView.lectureId) === String(videoObj.belongIn)) {
        lectureIndex = i;
      }

      index = aView.videos.findIndex(
        (video) => String(video.videoId) === String(id)
      );
      return index !== -1;
    });

    let newViewed = [];
    const newVideo = {
      videoId: id,
      videoTitle: videoObj.title,
      videoCode: videoObj.embededCode,
      videoIndex: videoObj.videoIndex,
      player: videoObj.player,
      time,
      duration,
    };
    if (lectureIndex !== -1) {
      // this lecture of video already exists in viewed
      newViewed = viewed.filter((_, i) => i !== lectureIndex);

      let newVideos = viewed[lectureIndex].videos;
      if (index !== -1) {
        // this video already exists in viewed
        newVideos = aView.videos.filter((_, i) => i !== index);
      }

      newViewed = [
        {
          lectureId: videoObj.belongIn,
          videos: [newVideo, ...newVideos],
        },
        ...newViewed,
      ];
    } else {
      newViewed = [
        {
          lectureId: videoObj.belongIn,
          videos: [newVideo],
        },
        ...viewed,
      ];
    }

    // update in req.session
    req.session.user.viewed = newViewed;

    // update in DB
    await User.findByIdAndUpdate(_id, { viewed: newViewed });

    return res.status(200).json(newViewed);
  } catch (error) {
    console.log(error);
  }
};

export const deleteViewed = (req, res) => {};

export const postBooked = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id, booked },
    },
  } = req;

  if (checkArray(booked, id)) {
    return res.sendStatus(400);
  }

  const newBooked = [id, ...booked];

  // update in req.session
  req.session.user.booked = newBooked;

  // update in DB
  await User.findByIdAndUpdate(_id, { booked: newBooked });

  return res.sendStatus(200);
};

export const deleteBooked = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id, booked },
    },
  } = req;

  if (!checkArray(booked, id)) {
    return res.sendStatus(400);
  }

  const newBooked = booked.filter((aBook) => String(aBook) !== String(id));

  // update in req.session
  req.session.user.booked = newBooked;

  // update in DB
  await User.findByIdAndUpdate(_id, { booked: newBooked });

  return res.sendStatus(200);
};

export const postLiked = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id, liked, hated },
    },
  } = req;
  let isHated = false;

  try {
    const lecture = await Lecture.findById(id, "meta");

    if (!lecture) {
      return res.sendStatus(404);
    }

    if (checkArray(liked, id)) {
      return res.sendStatus(400);
    }
    if (checkArray(hated, id)) {
      isHated = true;
    }

    const newLiked = [id, ...liked];
    const newHated = !isHated
      ? hated
      : hated.filter((aHate) => String(aHate) !== String(id));

    // update in req.session
    req.session.user.liked = newLiked;
    req.session.user.hated = newHated;

    // update in DB
    await User.findByIdAndUpdate(_id, {
      liked: newLiked,
      hated: newHated,
    });
    lecture.meta.likes += 1;
    if (isHated) {
      lecture.meta.hates -= 1;
    }
    await lecture.save();

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
};

export const deleteLiked = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id, liked },
    },
  } = req;

  try {
    const lecture = await Lecture.findById(id, "meta");

    if (!lecture) {
      return res.sendStatus(404);
    }

    if (!checkArray(liked, id)) {
      return res.sendStatus(400);
    }

    const newLiked = liked.filter((aLike) => String(aLike) !== String(id));

    // update in req.session
    req.session.user.liked = newLiked;

    // update in DB
    await User.findByIdAndUpdate(_id, { liked: newLiked });
    lecture.meta.likes -= 1;
    await lecture.save();

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
};

export const postHated = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id, liked, hated },
    },
  } = req;
  let isLiked = false;

  try {
    const lecture = await Lecture.findById(id, "meta");

    if (!lecture) {
      return res.sendStatus(404);
    }

    if (checkArray(hated, id)) {
      return res.sendStatus(400);
    }
    if (checkArray(liked, id)) {
      isLiked = true;
    }

    const newHated = [id, ...hated];
    const newLiked = !isLiked
      ? liked
      : liked.filter((aLike) => String(aLike) !== String(id));

    // update in req.session
    req.session.user.hated = newHated;
    req.session.user.liked = newLiked;

    // update in DB
    await User.findByIdAndUpdate(_id, {
      hated: newHated,
      liked: newLiked,
    });
    lecture.meta.hates += 1;
    if (isLiked) {
      lecture.meta.likes -= 1;
    }
    await lecture.save();

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
};

export const deleteHated = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id, hated },
    },
  } = req;

  try {
    const lecture = await Lecture.findById(id, "meta");

    if (!lecture) {
      return res.sendStatus(404);
    }

    if (!checkArray(hated, id)) {
      return res.sendStatus(400);
    }

    const newHated = hated.filter((aHate) => String(aHate) !== String(id));

    // update in req.session
    req.session.user.hated = newHated;

    // update in DB
    await User.findByIdAndUpdate(_id, { hated: newHated });
    lecture.meta.hates -= 1;
    await lecture.save();

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
};

export const startSocialLogin = (req, res) => {
  const { social } = req.params;
  switch (social) {
    case "github":
      return startGithubLogin(req, res);
    case "kakao":
      return startKakaoLogin(req, res);
    case "naver":
      return startNaverLogin(req, res);
    case "google":
      return startGoogleLogin(req, res);
    default:
      return;
  }
};

export const finishSocialLogin = (req, res) => {
  const { social } = req.params;
  switch (social) {
    case "github":
      return finishGithubLogin(req, res);
    case "kakao":
      return finishKakaoLogin(req, res);
    case "naver":
      return finishNaverLogin(req, res);
    case "google":
      return finishGoogleLogin(req, res);
    default:
      return;
  }
};

export const logout = async (req, res) => {
  await req.session.destroy();
  return res.sendStatus(200);
};

// internal functions

const checkArray = (array, targetId) => {
  let result = false;
  for (let i = 0; i < array.length; ++i) {
    if (String(array[i]) === String(targetId)) {
      result = true;
      break;
    }
  }
  return result;
};
