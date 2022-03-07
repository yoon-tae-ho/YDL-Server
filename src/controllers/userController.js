import User from "../models/User";
import Video from "../models/Video";
import {
  startGithubLogin,
  finishGithubLogin,
  startKakaoLogin,
  finishKakaoLogin,
  startNaverLogin,
  finishNaverLogin,
} from "./socialController";

export const getUser = async (req, res) => {
  const { loggedIn, user } = req.session;

  if (!loggedIn) {
    return res.sendStatus(404);
  }

  const viewed = await Promise.all(
    user.viewed.map(async (obj) => ({
      video: await Video.findById(obj.video),
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
export const postBooked = (req, res) => {};
export const deleteBooked = (req, res) => {};
export const postLiked = (req, res) => {};
export const deleteLiked = (req, res) => {};
export const postHated = (req, res) => {};
export const deleteHated = (req, res) => {};

export const startSocialLogin = (req, res) => {
  const { social } = req.params;
  switch (social) {
    case "github":
      return startGithubLogin(req, res);
    case "kakao":
      return startKakaoLogin(req, res);
    case "naver":
      return startNaverLogin(req, res);
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
    default:
      return;
  }
};

export const logout = async (req, res) => {
  await req.session.destroy();
  return res.sendStatus(200);
};
