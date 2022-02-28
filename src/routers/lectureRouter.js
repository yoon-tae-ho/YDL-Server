import express from "express";
import {
  getInitial,
  getLecturePreviews,
  getLectureDetail,
  getLecturesOfTopic,
  getLecturesByTopicName,
  getLecturesOfInstructors,
} from "../controllers/lectureController";

const lectureRouter = express.Router();

lectureRouter.get("/", getLecturePreviews);
lectureRouter.get("/initial", getInitial);
lectureRouter.get(`/:id(${process.env.MONGO_REGEX_FORMAT})`, getLectureDetail);
lectureRouter.get(
  `/topics/:id(${process.env.MONGO_REGEX_FORMAT})`,
  getLecturesOfTopic
);
lectureRouter.get(`/topics/name/:name`, getLecturesByTopicName);
lectureRouter.get(
  `/instructors/:id(${process.env.MONGO_REGEX_FORMAT})`,
  getLecturesOfInstructors
);

export default lectureRouter;
