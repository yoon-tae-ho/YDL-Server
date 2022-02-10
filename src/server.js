// Modules
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

import apiRouter from "./routers/apiRouter";

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CORS_URL,
    optionsSuccessStatus: 200,
  })
);

// Routes
app.use("/api", apiRouter);

// Added Fake Data
// import {fakeData} from "./fakeData";
// app.get("/", fakeData);

export default app;
