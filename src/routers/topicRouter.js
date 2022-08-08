import express from "express";
import {
  getInitial,
  getLecturesOfTopic,
  getLecturesByTopicName,
  getLecturesOfInstructors,
  browseTopics,
} from "../controllers/topicController";

const topicRouter = express.Router();

topicRouter.get("/initial", getInitial);
topicRouter.get("/browse", browseTopics);
topicRouter.get(`/:id`, getLecturesOfTopic);
topicRouter.get(`/name/:name`, getLecturesByTopicName);
topicRouter.get(
  `/instructors/:id(${process.env.MONGO_REGEX_FORMAT})`,
  getLecturesOfInstructors
);

export default topicRouter;
