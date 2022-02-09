import mongoose from "mongoose";

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("✅ connected to DB"))
  .catch((error) => console.log(error.message));
