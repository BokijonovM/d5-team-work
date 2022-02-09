import { Router } from "express";
import Review from "./model.js";

const reviewsRouter = Router();

reviewsRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await Review.findAll({});
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:review_id", async (req, res, next) => {
  try {
    const singleReview = await Review.findByPk(req.params.review_id);
    if (singleReview) {
      res.send(singleReview);
    } else {
      res.status(404).send({ error: "No such review" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

reviewsRouter.post("/", async (req, res, next) => {
  try {
    const newReview = await Review.create(req.body);
    res.send(newReview);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default reviewsRouter;
