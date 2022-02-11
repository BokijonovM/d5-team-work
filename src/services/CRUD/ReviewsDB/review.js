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
      include: [Product, Category],
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
    const singleReview = await Review.findOne({
      where: {
        review_id: req.params.review_id,
      },
      include: [
        Category,
        Product,
        {
          model: Category,
          attribute: ["name"],
        },
      ],
    });
    if (singleReview) {
      res.send(singleReview);
    } else {
      res.status(404).send({ message: "No such review" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

reviewsRouter.post("/", async (req, res, next) => {
  try {
    const newReview = await Review.create(req.body);
    if (req.body.categories) {
      for await (const categoryName of req.body.categories) {
        const category = await Category.create({ name: categoryName });
        await newReview.addCategory(category, {
          through: { selfGranted: false },
        });
      }
    }

    const reviewWithCategory = await Review.findOne({
      where: { review_id: newReview.review_id },
      include: [Category, Product, User],
    });
    res.send(reviewWithCategory);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

reviewsRouter.post("/:review_id/user", async (req, res, next) => {
  try {
    const newUser = await User.create({
      ...req.body,
      reviewId: req.params.review_id,
    });
    res.send(newUser);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

reviewsRouter.post("/:review_id/category", async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.review_id);
    if (review) {
      const category = await Category.create(req.body);

      await review.addCategory(category, { through: { selfGranted: false } });
      res.send(category);
    } else {
      res.status(404).send({ error: "Review not found" });
    }
  } catch (error) {}
});

reviewsRouter.delete(
  "/:review_id/category/:categoryId",
  async (req, res, next) => {
    try {
      const review = await Review.findByPk(req.params.id);
      if (review) {
        const category = await Category.findByPk(req.params.categoryId);

        await review.removeCategory(category);
        const reviewWithCategory = await Review.findOne({
          where: { review_id: req.params.review_id },
          include: [Category, Product, User],
        });
        res.send(reviewWithCategory);
      } else {
        res.status(404).send({ error: "Review not found" });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

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
