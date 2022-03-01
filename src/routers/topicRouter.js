import express from "express";
import {
  getInitial,
  getMore,
  getLecturesOfTopic,
  getLecturesByTopicName,
} from "../controllers/topicController";

const topicRouter = express.Router();

topicRouter.get("/initial", getInitial);
topicRouter.get("/more", getMore);
topicRouter.get(`/:id(${process.env.MONGO_REGEX_FORMAT})`, getLecturesOfTopic);
topicRouter.get(`/name/:name`, getLecturesByTopicName);

export default topicRouter;
