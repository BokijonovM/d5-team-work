import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import { getReview, writeReview } from "../../libs/fs-toolsReview.js";

const reviewRouter = express.Router();
const postsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../Data/reviews.json"
);

reviewRouter.post("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
reviewRouter.get("/", async (req, res, next) => {
  const reviewArray = await getReview();
  res.send(reviewArray);
  try {
  } catch (error) {
    next(error);
  }
});

export default reviewRouter;
