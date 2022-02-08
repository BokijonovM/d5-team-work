import express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import pool from "../../../utils/db/connect.js";
import { parseFile, uploadFile } from "../../files/index.js";
import {
  getProducts,
  writeProducts,
  getReview,
  writeReview,
} from "../../libs/fs-toolsReview.js";

const productsRouter = express.Router();

productsRouter.post("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      `INSERT INTO products(product_name, product_desc, product_brand, product_price ,product_category) VALUES($1,$2,$3,$4,$5) RETURNING *;`,
      [
        req.body.product_name,
        req.body.product_desc,
        req.body.product_brand,
        req.body.product_price,
        req.body.product_category,
      ]
    );
    res.send(result.rows[0]);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

productsRouter.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(`SELECT * FROM products;`);
    res.send(result.rows);
  } catch (error) {
    res.status(500).send({ message: error.message });
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
    const filtered = reviewArray.filter(
      ({ productId }) => productId === req.params.productId
    );
    res.send(filtered);
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

// upload images

productsRouter.put(
  "/:productId/imageUrl",
  parseFile.single("imageUrl"),
  uploadFile,
  async (req, res, next) => {
    try {
      const fileAsJSONArray = await getProducts();

      const blogIndex = fileAsJSONArray.findIndex(
        blog => blog.id === req.params.productId
      );
      if (!blogIndex == -1) {
        res
          .status(404)
          .send({ message: `blog with ${req.params.productId} is not found!` });
      }
      const previousblogData = fileAsJSONArray[blogIndex];
      const changedblog = {
        ...previousblogData,
        cover: req.file,
        updatedAt: new Date(),
        id: req.params.productId,
      };
      fileAsJSONArray[blogIndex] = changedblog;

      await writeProducts(fileAsJSONArray);
      res.send(changedblog);
    } catch (error) {
      next(error);
    }
  }
);
export default productsRouter;
