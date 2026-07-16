import dotenv from 'dotenv'
import express from "express";
import cors from "cors";
import userRouter from "./apps/user/user-router.js";
import placeRouter from "./apps/place/place-router.js"

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/places", placeRouter)

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
