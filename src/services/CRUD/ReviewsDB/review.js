import { Router } from "express";
import Product from "../ProductsDB/model.js";
import Review from "./model.js";
import { Op } from "sequelize";
import Category from "./categories.model.js";
import sequelize from "sequelize";
import User from "./user.model.js";

const reviewsRouter = Router();

reviewsRouter.get("/", async (req, res, next) => {
  try {
    const { offset = 0, limit = 9 } = req.query;
    const totalReview = await Review.count({});

    const reviews = await Review.findAll({
      include: [Product, Category, User],
      offset,
      limit,
    });
    res.send({ data: reviews, count: totalReview });
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/search", async (req, res, next) => {
  try {
    console.log({ query: req.query });
    const reviews = await Review.findAll({
      where: {
        [Op.or]: [
          {
            text: {
              [Op.iLike]: `%${req.query.q}%`,
            },
          },
        ],
      },
      include: [Product],
    });
    res.send(reviews);
  } catch (error) {
    console.log(error);
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

reviewsRouter.put("/:review_id", async (req, res, next) => {
  try {
    const [success, updateREview] = await Review.update(req.body, {
      where: { review_id: req.params.review_id },
      returning: true,
    });
    if (success) {
      res.send(updateREview);
    } else {
      res.status(404).send({ message: "no such review" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

reviewsRouter.delete("/:review_id", async (req, res, next) => {
  try {
    await Review.destroy({
      where: { review_id: req.params.review_id },
    });
    res.send(
      `Review with id ${req.params.review_id} has successfully deleted!`
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default reviewsRouter;
