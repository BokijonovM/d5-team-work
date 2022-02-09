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
    const singleProduct = await Product.findByPk(req.params.product_id);
    if (singleProduct) {
      res.send(singleProduct);
    } else {
      res.status(404).send({ error: "No such product" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//

productsRouter.post("/", async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);
    res.send(newProduct);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

productsRouter.put("/:product_id", async (req, res, next) => {
  try {
    //
    const [success, updateProduct] = await Product.update(req.body, {
      where: { product_id: req.params.product_id },
      returning: true,
    });
    if (success) {
      res.send(updateProduct);
    } else {
      res.status(404).send({ message: "no such product" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

productsRouter.delete("/:product_id", async (req, res, next) => {
  try {
    await Product.destroy({
      where: {
        product_id: req.params.product_id,
      },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default productsRouter;
