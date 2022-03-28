import express from "express";
import {
  searchLectures,
  getLectureDetail,
  getFirstVideo,
} from "../controllers/lectureController";

const lectureRouter = express.Router();

lectureRouter.get("/search/:text", searchLectures);
lectureRouter.get(
  `/:id(${process.env.MONGO_REGEX_FORMAT})/first-video`,
  getFirstVideo
);
lectureRouter.get(`/:id(${process.env.MONGO_REGEX_FORMAT})`, getLectureDetail);

export default lectureRouter;
