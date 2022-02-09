import { Router } from "express";
import Product from "./model.js";

const productsRouter = Router();

productsRouter.get("/", async (req, res, next) => {
  try {
    const pro = await Product.findAll({});
    res.send(pro);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

productsRouter.get("/:product_id", async (req, res, next) => {
  try {
    const singleProduct = await Product.findByPk(req.params.id);
    if (singleProduct) {
      res.send(singleProduct);
    } else {
      res.status(404).send({ error: "No such product" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default productsRouter;
