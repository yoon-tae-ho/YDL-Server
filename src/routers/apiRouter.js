import express from "express";
import { getAllLectures } from "../controllers/lectureController";

const apiRouter = express.Router();

// Lectures
apiRouter.get("/lectures", getAllLectures);

export default apiRouter;
