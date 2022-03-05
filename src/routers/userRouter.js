import express from "express";
import {
  getUser,
  putUser,
  deleteUser,
  postViewed,
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

const userRouter = express.Router();

userRouter.get("/social/:social/start", startSocialLogin);
userRouter.get("/social/:social/finish", finishSocialLogin);
userRouter.get("/logout", logout);
userRouter.route("/").get(getUser).put(putUser).delete(deleteUser);
userRouter
  .route(`/viewed/:id(${process.env.MONGO_REGEX_FORMAT})`) // id of lecture
  .post(postViewed)
  .put(putViewed)
  .delete(deleteViewed);
userRouter
  .route(`/booked/:id(${process.env.MONGO_REGEX_FORMAT})`) // id of lecture
  .post(postBooked)
  .delete(deleteBooked);
userRouter
  .route(`/liked/:id(${process.env.MONGO_REGEX_FORMAT})`) // id of lecture
  .post(postLiked)
  .delete(deleteLiked);
userRouter
  .route(`/hated/:id(${process.env.MONGO_REGEX_FORMAT})`) // id of lecture
  .post(postHated)
  .delete(deleteHated);

export default userRouter;
