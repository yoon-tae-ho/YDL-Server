import bcrypt from "bcrypt";

import User from "../models/User";
import Video from "../models/Video";

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

// login
export const postUser = async (req, res) => {
  const {
    body: { email, password },
  } = req;
  try {
    const user = await User.findOne({ email }).lean();

    // Bad email
    if (!user) {
      return res.sendStatus(404);
    }
    // Bad password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.sendStatus(400);
    }

    // login
    req.session.loggedIn = true;
    req.session.user = { ...user, password: null };

    return res.status(200).json(req.session.user);
  } catch (error) {
    console.log(error);
  }
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

export const join = async (req, res) => {
  const {
    body: { email, username, password, password2 },
  } = req;

  // Bad password
  if (password !== password2) {
    return res.status(400).json({ errorMessage: "badPassword" });
  }

  try {
    // Bad email
    if (await User.exists({ email })) {
      return res.status(400).json({ errorMessage: "badEmail" });
    }

    const user = await User.create({
      email,
      username,
      password,
    });

    // automatic login
    req.session.loggedIn = true;
    req.session.user = {
      ...user._doc,
      password: null,
    };

    res.status(201).json(req.session.user);
  } catch (error) {
    console.log(error);
  }
};
