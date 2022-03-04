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
    secret: process.env.COOKIE_SECRET,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    resave: false,
    saveUninitialized: false, // dont save session in DB if he did not login.
    cookie: {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // One Week
      // secure: true, // after https
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
