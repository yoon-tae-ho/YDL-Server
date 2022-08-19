import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";

const isHeroku = process.env.NODE_ENV === "production";

const whitelist = process.env.CORS_URLS.split(" ");
export const corsMiddleware = cors({
  origin: function (origin, callback) {
    // bypass the requests with no origin (like curl requests, mobile apps, redirect, etc )
    if (!origin) return callback(null, true);

    if (whitelist.indexOf(origin) === -1) {
      var msg = "Not allowed by CORS";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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
    sameSite: isHeroku ? "none" : "strict",
    maxAge: 3 * 24 * 60 * 60 * 1000, // Three Days
    secure: isHeroku, // after https
  },
});

export const protectorMiddleware = (req, res, next) => {
  if (!req.session || !req.session.loggedIn) {
    return res.sendStatus(401);
  }
  return next();
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return res.status(403).redirect(`${whitelist[0]}/`); // user detail 페이지 작성 후에는 거기로 redirect.
  }
  return next();
};
