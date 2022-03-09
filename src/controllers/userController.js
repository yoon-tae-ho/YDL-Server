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

export const getUser = async (req, res) => {
  const { loggedIn, user } = req.session;

  if (!loggedIn) {
    return res.sendStatus(404);
  }

  const viewed = await Promise.all(
    user.viewed.map(async (obj) => ({
      video: await Video.findById(obj.video, {
        select: "belongIn embededCode player",
      }).lean(),
      time: obj.time,
    }))
  );

  const client = {
    email: user.email,
    username: user.username,
    avatarUrl: user.avatarUrl,
    viewed,
    booked: user.booked,
    liked: user.liked,
    hated: user.hated,
  };

  return res.status(200).json(client);
};

export const putUser = (req, res) => {};
export const deleteUser = (req, res) => {};
export const postViewed = (req, res) => {};
export const putViewed = (req, res) => {};
export const deleteViewed = (req, res) => {};

export const postBooked = (req, res) => {
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

  // update in DB
  User.findByIdAndUpdate(_id, { booked: newBooked });

  // update in req.session
  req.session.user.booked = newBooked;

  return res.sendStatus(200);
};

export const deleteBooked = (req, res) => {
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

  // update in DB
  User.findByIdAndUpdate(_id, { booked: newBooked });

  // update in req.session
  req.session.user.booked = newBooked;

  return res.sendStatus(200);
};

export const postLiked = (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id, liked, hated },
    },
  } = req;
  let isHated = false;

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

  // update in DB
  User.findByIdAndUpdate(_id, {
    liked: newLiked,
    hated: newHated,
  });

  // update in req.session
  req.session.user.liked = newLiked;
  req.session.user.hated = newHated;

  return res.sendStatus(200);
};

export const deleteLiked = (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id, liked },
    },
  } = req;

  if (!checkArray(liked, id)) {
    return res.sendStatus(400);
  }

  const newLiked = liked.filter((aLike) => String(aLike) !== String(id));

  // update in DB
  User.findByIdAndUpdate(_id, { liked: newLiked });

  // update in req.session
  req.session.user.liked = newLiked;

  return res.sendStatus(200);
};

export const postHated = (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id, liked, hated },
    },
  } = req;
  let isLiked = false;

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

  // update in DB
  User.findByIdAndUpdate(_id, {
    hated: newHated,
    liked: newLiked,
  });

  // update in req.session
  req.session.user.hated = newHated;
  req.session.user.liked = newLiked;

  return res.sendStatus(200);
};

export const deleteHated = (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id, hated },
    },
  } = req;

  if (!checkArray(hated, id)) {
    return res.sendStatus(400);
  }

  const newHated = hated.filter((aHate) => String(aHate) !== String(id));

  // update in DB
  User.findByIdAndUpdate(_id, { hated: newHated });

  // update in req.session
  req.session.user.hated = newHated;

  return res.sendStatus(200);
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
