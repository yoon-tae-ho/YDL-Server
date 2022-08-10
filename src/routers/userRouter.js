import express from "express";
import {
  getUser,
  putUser,
  deleteUser,
  getViewed,
  putViewed,
  deleteViewed,
  postBooked,
  deleteBooked,
  postLiked,
  deleteLiked,
  postHated,
  deleteHated,
  startSocialLogin,
  finishSocialLogin,
  logout,
} from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

// user data
userRouter
  .route(`/viewed/:id(${process.env.MONGO_REGEX_FORMAT})`) // id of video
  .get(getViewed)
  .all(protectorMiddleware)
  .put(putViewed)
  .delete(deleteViewed);
userRouter
  .route(`/booked/:id(${process.env.MONGO_REGEX_FORMAT})`) // id of lecture
  .all(protectorMiddleware)
  .post(postBooked)
  .delete(deleteBooked);
userRouter
  .route(`/liked/:id(${process.env.MONGO_REGEX_FORMAT})`) // id of lecture
  .all(protectorMiddleware)
  .post(postLiked)
  .delete(deleteLiked);
userRouter
  .route(`/hated/:id(${process.env.MONGO_REGEX_FORMAT})`) // id of lecture
  .all(protectorMiddleware)
  .post(postHated)
  .delete(deleteHated);
userRouter
  .route("/")
  .get(getUser)
  .all(protectorMiddleware)
  .put(putUser)
  .delete(deleteUser);

// login / logout
userRouter.get("/social/:social/start", publicOnlyMiddleware, startSocialLogin);
userRouter.get(
  "/social/:social/finish",
  publicOnlyMiddleware,
  finishSocialLogin
);
userRouter.get("/logout", protectorMiddleware, logout);

export default userRouter;
