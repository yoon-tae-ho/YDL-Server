import express from "express";
import {
  getInitial,
  getMore,
  getLecturesOfTopic,
  getLecturesByTopicName,
  getLecturesOfInstructors,
} from "../controllers/topicController";

const topicRouter = express.Router();

topicRouter.get("/initial", getInitial);
topicRouter.get("/more", getMore);
topicRouter.get(`/:id`, getLecturesOfTopic);
topicRouter.get(`/name/:name`, getLecturesByTopicName);
topicRouter.get(
  `/instructors/:id(${process.env.MONGO_REGEX_FORMAT})`,
  getLecturesOfInstructors
);

export default topicRouter;
