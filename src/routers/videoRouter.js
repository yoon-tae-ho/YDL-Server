import express from "express";
import { getNextVideo, getVideo } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get(`/:id(${process.env.MONGO_REGEX_FORMAT})/next`, getNextVideo);
videoRouter.get(`/:id(${process.env.MONGO_REGEX_FORMAT})`, getVideo);

export default videoRouter;
