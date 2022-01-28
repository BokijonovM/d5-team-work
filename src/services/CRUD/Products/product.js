import express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { newProductValidation } from "./validation.js";

import { getProducts, writeProducts } from "../..//libs/fs-toolsReview.js";

const productsRouter = express.Router();

productsRouter.post("/", newProductValidation, async (req, res, next) => {
  try {
    
      const newproduct = { ...req.body, createdAt: new Date(), id: uniqid() };

      const productsArray = await getProducts();

      productsArray.push(newproduct);

      await writeProducts(productsArray);

      res.send(newproduct)
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/", async (req, res, next) => {
  try {
    const productsArray = await getProducts();

    if (req.query && req.query.category) {
      const filteredproducts = productsArray.filter(
        (product) => product.category === req.query.category
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
      (product) => product.id === productId
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

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const productsArray = await getProducts();
    const index = productsArray.findIndex(
      (product) => product.id === productId
    );
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

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const productsArray = await getProducts();
    const remaningproducts = productsArray.filter(
      (product) => product.id !== productId
    );
    await writeProducts(remaningproducts);
    res.send(`Product wit ${productId} has successfully removed!`);
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
