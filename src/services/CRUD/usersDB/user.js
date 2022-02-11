import { Router } from "express";
import { Op } from "sequelize";
import sequelize from "sequelize";
import Users from "./model.js";
import Product from "../ProductsDB/model.js";
import Cards from "./card.model.js";

const usersRouter = Router();

usersRouter.get("/", async (req, res, next) => {
  try {
    const { offset = 0, limit = 9 } = req.query;
    const totalUsers = await Users.count({});

    const users = await Users.findAll({
      include: [Product, Cards],
      offset,
      limit,
    });
    res.send({ data: users, count: totalUsers });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = await Users.create(req.body);
    const userWithCategory = await Users.findOne({
      where: { id: newUser.id },
    });

    res.send(userWithCategory);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

usersRouter.get("/:id/cart", async (req, res, next) => {
  try {
    const totalItems = await Cards.count({
      where: { id: req.params.id },
    });

    const totalPrice = await Cards.sum("products.price", {
      where: { id: req.params.id },
      include: [{ model: Product, attributes: [] }],
    });

    const user = await Users.findByPk(req.params.id);

    if (user) {
      const cart = await Cards.findAll({
        where: { id: req.params.id },
        include: [Product],
        attribute: [
          [
            sequelize.cast(
              sequelize.fn("count", sequelize.col("products.product_id")),
              "integer"
            ),
            "quantity",
          ],
        ],
        group: ["products.product_id"],
      });
      res.status(200).send({ totalItems, totalPrice, cart });
    } else {
      res.status(400).send("invalid user or product id");
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

usersRouter.post("/:id/cart", async (req, res, next) => {
  try {
    const newCart = await Users.findByPk(req.params.id);
    if (newCart) {
      const card = await Cards.create(req.body);

      await newCart.addCards(card, { through: { selfGranted: false } });
      res.send(card);
    } else {
      res.status(404).send({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

usersRouter.get("/:id", async (req, res, next) => {
  try {
    const singleUser = await Users.findOne({
      where: {
        id: req.params.id,
      },
      include: [Product, Cards],
    });
    if (singleUser) {
      res.send(singleUser);
    } else {
      res.status(404).send({ message: "No such user" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

usersRouter.put("/:id", async (req, res, next) => {
  try {
    const [success, updateUser] = await Users.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    if (success) {
      res.send(updateUser);
    } else {
      res.status(404).send({ message: "no such user" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.delete("/:id", async (req, res, next) => {
  try {
    await Users.destroy({
      where: { id: req.params.id },
    });
    res.send(`User with id ${req.params.id} has successfully deleted!`);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default usersRouter;
