import express from "express";
import {
  getLecturePreviews,
  getLectureDetail,
  getLecturesOfTopic,
  getLecturesOfInstructors,
} from "../controllers/lectureController";

const lectureRouter = express.Router();

lectureRouter.get("/", getLecturePreviews);
lectureRouter.get(`/:id(${process.env.MONGO_REGEX_FORMAT})`, getLectureDetail);
lectureRouter.get(
  `/topics/:id(${process.env.MONGO_REGEX_FORMAT})`,
  getLecturesOfTopic
);
lectureRouter.get(
  `/instructors/:id(${process.env.MONGO_REGEX_FORMAT})`,
  getLecturesOfInstructors
);

export default lectureRouter;
