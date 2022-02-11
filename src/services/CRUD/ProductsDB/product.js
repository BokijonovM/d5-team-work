import { Router } from "express";
import Product from "./model.js";
import { Op } from "sequelize";
import Review from "./review.model.js";
import Category from "./categories.model.js";

const productsRouter = Router();

productsRouter.get("/", async (req, res, next) => {
  try {
    const { offset = 0, limit = 9 } = req.query;
    const totalProduct = await Product.count({});

    const products = await Product.findAll({
      include: [Review, Category],
      offset,
      limit,
    });
    res.send({ data: products, count: totalProduct });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

productsRouter.get("/search", async (req, res, next) => {
  try {
    console.log({ query: req.query });
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${req.query.q}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${req.query.q}%`,
            },
          },
        ],
      },
    });
    res.send(products);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

productsRouter.get("/:product_id", async (req, res, next) => {
  try {
    const singleProduct = await Product.findOne({
      where: {
        product_id: req.params.product_id,
      },
      include: [
        Category,
        Review,
        {
          model: Category,
          attribute: ["name"],
        },
      ],
    });
    if (singleProduct) {
      res.send(singleProduct);
    } else {
      res.status(404).send({ message: "No such product" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//

productsRouter.post("/", async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);
    if (req.body.category) {
      for await (const categoryName of req.body.category) {
        const category = await Category.create({ name: categoryName });
        await newProduct.addCategory(category, {
          through: { selfGranted: false },
        });
      }
    }

    const ProductWithCategory = await Product.findOne({
      where: { product_id: newProduct.product_id },
      include: [Review, Category],
    });

    res.send(ProductWithCategory);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

productsRouter.post("/:product_id/category", async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.product_id);
    if (product) {
      const category = await Category.create(req.body);

      await product.addCategory(category, { through: { selfGranted: false } });
      res.send(category);
    } else {
      res.status(404).send({ error: "Product not found" });
    }
  } catch (error) {}
});

productsRouter.delete(
  "/:product_id/category/:categoryId",
  async (req, res, next) => {
    try {
      const product = await Product.findByPk(req.params.product_id);
      if (product) {
        const category = await Category.findByPk(req.params.categoryId);

        await product.removeCategory(category);
        const productWithCategory = await Product.findOne({
          where: { product_id: req.params.product_id },
          include: [Category, Review],
        });
        res.send(productWithCategory);
      } else {
        res.status(404).send({ error: "Product not found" });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

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
