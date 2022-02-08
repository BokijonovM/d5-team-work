import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import { getReview, writeReview } from "../../libs/fs-toolsReview.js";
import { checkBlogPostSchema, checkValidationResult } from "./validation.js";
import pool from "../../../utils/db/connect.js";

const reviewRouter = express.Router();
const postsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../Data/reviews.json"
);

// post method

reviewRouter.post("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      `INSERT INTO reviews(comment,review_rate,product_id) VALUES($1,$2,$3) RETURNING *;`,
      [req.body.comment, req.body.review_rate, req.body.product_id]
    );
    res.send(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// get method

reviewRouter.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM reviews JOIN products ON reviews.product_id=products.product_id;`
    );
    res.send(result.rows);
  } catch (error) {
    next(error);
  }
});

// get method by ID

reviewRouter.get("/:review_id", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM reviews JOIN products ON reviews.product_id=products.product_id WHERE review_id=$1;`,
      [req.params.review_id]
    );
    if (result.rows[0]) {
      res.send(result.rows);
    } else {
      res.status(404).send({ message: "No such review." });
    }
  } catch (error) {
    next(error);
  }
});

// put method

reviewRouter.put("/:review_id", async (req, res, next) => {
  try {
    const result = await pool.query(
      `UPDATE reviews SET comment=$1,review_rate=$2 WHERE review_id=$3 RETURNING * ;`,
      [req.body.comment, req.body.review_rate, req.params.review_id]
    );
    res.send(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// delete method

reviewRouter.delete("/:id", async (req, res, next) => {
  try {
    const reviewId = req.params.id;

    const postsArray = await getReview();

    const remainingPosts = postsArray.filter(post => post.id !== reviewId);

    await writeReview(remainingPosts);

    res.send({ message: `Post with ${reviewId} is successfully deleted` });
  } catch (error) {
    next(error);
  }
});

export default reviewRouter;
