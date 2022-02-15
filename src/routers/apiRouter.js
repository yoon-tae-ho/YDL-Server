import express from "express";
import { getLecturePreviews } from "../controllers/lectureController";

const apiRouter = express.Router();

// Lectures
apiRouter.get("/lectures", getLecturePreviews);

export default apiRouter;
