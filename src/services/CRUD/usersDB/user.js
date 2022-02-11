import { Router } from "express";
import { Op } from "sequelize";
import sequelize from "sequelize";
import Users from "./model.js";
import Product from "../ProductsDB/model.js";

const usersRouter = Router();

usersRouter.get("/", async (req, res, next) => {
  try {
    const { offset = 0, limit = 9 } = req.query;
    const totalUsers = await Users.count({});

    const users = await Users.findAll({
      include: [Product],
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

usersRouter.get("/:id", async (req, res, next) => {
  try {
    const singleUser = await Users.findOne({
      where: {
        id: req.params.id,
      },
      include: [Product],
    });
    if (singleUser) {
      res.send(singleUser);
    } else {
      res.status(404).send({ message: "No such user" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

usersRouter.put("/:id", async (req, res, next) => {
  try {
    const [success, updatedUser] = await Users.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    if (success) {
      res.send(updatedUser);
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
