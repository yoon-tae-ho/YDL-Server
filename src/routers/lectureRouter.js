import express from "express";
import {
  getLecturePreviews,
  getLectureDetail,
  getLecturesOfTopic,
  getLecturesOfInstructors,
} from "../controllers/lectureController";

const lectureRouter = express.Router();

lectureRouter.get("/", getLecturePreviews);
lectureRouter.get(`/:id(${process.env.MONGO_RE_FORMAT})`, getLectureDetail);
lectureRouter.get(
  `/topics/:id(${process.env.MONGO_RE_FORMAT})`,
  getLecturesOfTopic
);
lectureRouter.get(
  `/instructors/:id(${process.env.MONGO_RE_FORMAT})`,
  getLecturesOfInstructors
);

export default lectureRouter;
