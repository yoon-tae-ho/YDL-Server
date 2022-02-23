import express from "express";
import {
  getUser,
  postUser,
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
} from "../controllers/userController";

const userRouter = express.Router();

userRouter
  .route("/")
  .get(getUser)
  .post(postUser)
  .put(putUser)
  .delete(deleteUser);
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

// get이 필요?

export default userRouter;
