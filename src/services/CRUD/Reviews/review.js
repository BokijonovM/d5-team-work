import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import { getReview, writeReview } from "../../libs/fs-toolsReview.js";
import { checkBlogPostSchema, checkValidationResult } from "./validation.js";

const reviewRouter = express.Router();
const postsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../Data/reviews.json"
);

// post method

reviewRouter.post(
  "/",
  checkBlogPostSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const newReview = {
        ...req.body,
        createdAt: new Date(),
        id: uniqid(),
      };
      const reviewArray = await getReview();

      reviewArray.push(newReview);

      await writeReview(reviewArray);

      res.send(newReview);
    } catch (error) {
      next(error);
    }
  }
);

// get method

reviewRouter.get("/", async (req, res, next) => {
  const reviewArray = await getReview();
  res.send(reviewArray);
  try {
  } catch (error) {
    next(error);
  }
});

// get method by ID

reviewRouter.get("/:id", async (req, res, next) => {
  const fileAsJSONArray = await getReview();
  const singleReview = fileAsJSONArray.find(
    singleReview => singleReview.id === req.params.id
  );
  if (!singleReview) {
    res
      .status(404)
      .send({ message: `Post with ${req.params.id} is not found!` });
  }
  res.send(singleReview);
  res.send(fileArray);
  try {
  } catch (error) {
    next(error);
  }
});

export default reviewRouter;
