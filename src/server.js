// Modules
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

import lectureRouter from "./routers/lectureRouter";
import userRouter from "./routers/userRouter";
import topicRouter from "./routers/topicRouter";
import { corsMiddleware, sessionMiddleware } from "./middlewares";

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(morgan("dev"));
app.use(corsMiddleware);
app.use(sessionMiddleware);

// Routes
app.use("/topics", topicRouter);
app.use("/lectures", lectureRouter);
app.use("/user", userRouter);

// Add Data
import { getData } from "./data";
app.use("/data", getData);

// Add Fake Data
// import { fakeData } from "./fakeData";
// app.get("/", fakeData);

export default app;
