import express from "express";
import {
  getLecturePreviews,
  getLectureDetail,
  getFirstVideo,
} from "../controllers/lectureController";

const lectureRouter = express.Router();

lectureRouter.get("/", getLecturePreviews);
lectureRouter.get(`/:id(${process.env.MONGO_REGEX_FORMAT})`, getLectureDetail);
lectureRouter.get(
  `/:id(${process.env.MONGO_REGEX_FORMAT})/first-video`,
  getFirstVideo
);

export default lectureRouter;
