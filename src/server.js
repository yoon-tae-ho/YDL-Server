// Modules
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";

import lectureRouter from "./routers/lectureRouter";
import userRouter from "./routers/userRouter";
import topicRouter from "./routers/topicRouter";

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CORS_URL,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(
  session({
    secret: "test",
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: false,
    },
  })
);

// Routes
app.use("/topics", topicRouter);
app.use("/lectures", lectureRouter);
app.use("/user", userRouter);

// Add Fake Data
// import { fakeData } from "./fakeData";
// app.get("/", fakeData);

export default app;
