import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";

export const corsMiddleware = cors({
  origin: process.env.CORS_URL,
  optionsSuccessStatus: 200,
  credentials: true,
});

export const sessionMiddleware = session({
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
});

export const protectorMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return res.sendStatus(401);
  }
  return next();
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return res.status(403).redirect(`${process.env.CORS_URL}/`); // user detail 페이지 작성 후에는 거기로 redirect.
  }
  return next();
};
