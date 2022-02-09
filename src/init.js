import "dotenv/config";
import "./db";
import "./models/Lecture";
import "./models/Video";
import app from "./server";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
  console.log(`✅ Server listening on port http://localhost:${PORT}`)
);
