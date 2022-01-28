import express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { newProductValidation } from "./validation.js";
// import reviewRouter from "../Reviews/review.js";
import {
  checkBlogPostSchema,
  checkValidationResult,
} from "../Reviews/validation.js";

import {
  getProducts,
  writeProducts,
  getReview,
  writeReview,
} from "../..//libs/fs-toolsReview.js";

const productsRouter = express.Router();

productsRouter.post("/", newProductValidation, async (req, res, next) => {
  try {
    const newproduct = { ...req.body, createdAt: new Date(), id: uniqid() };

    const productsArray = await getProducts();

    productsArray.push(newproduct);

    await writeProducts(productsArray);

    res.send(newproduct);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/", async (req, res, next) => {
  try {
    const productsArray = await getProducts();

    if (req.query && req.query.category) {
      const filteredproducts = productsArray.filter(
        product => product.category === req.query.category
      );
      res.send(filteredproducts);
    } else {
      res.send(productsArray);
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const productsArray = await getProducts();
    const foundproduct = productsArray.find(
      product => product.id === productId
    );
    if (foundproduct) {
      res.send(foundproduct);
    } else {
      next(
        createHttpError(
          404,
          `product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const productsArray = await getProducts();
    const remaningproducts = productsArray.filter(
      product => product.id !== productId
    );
    await writeProducts(remaningproducts);
    res.send(`Product wit ${productId} has successfully removed!`);
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const productsArray = await getProducts();
    const index = productsArray.findIndex(product => product.id === productId);
    const oldproduct = productsArray[index];
    const updatedproduct = {
      ...oldproduct,
      ...req.body,
      updatedAt: new Date(),
    };
    productsArray[index] = updatedproduct;
    writeProducts(productsArray);
    res.send(updatedproduct);
  } catch (error) {
    next(error);
  }
});

productsRouter.post("/:productId/review", async (req, res, next) => {
  try {
    const newReview = {
      ...req.body,
      createdAt: new Date(),
      productId: req.params.productId,
      id: uniqid(),
    };
    const reviewArray = await getReview();

    reviewArray.push(newReview);

    await writeReview(reviewArray);

    res.send(newReview);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId/review", async (req, res, next) => {
  try {
    const reviewArray = await getReview();
    res.send(reviewArray);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId/review/:id", async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId/review/:id", async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const reviewArray = await getReview();

    const index = reviewArray.findIndex(review => review.id === reviewId);

    if (!index == -1) {
      res.status(404).send(`Review with ${reviewId} is not find!`);
    }
    const oldReview = reviewArray[index];
    const newReview = {
      ...oldReview,
      ...req.body,
      updatedAt: new Date(),
      id: reviewId,
    };
    reviewArray[index] = newReview;
    await writeReview(reviewArray);
    res.send(newReview);
  } catch (error) {
    next(error);
  }
});
productsRouter.delete("/:productId/review/:id", async (req, res, next) => {
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

export default productsRouter;
