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

export default usersRouter;
