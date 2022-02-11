import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
// import reviewsRouter from "./services/CRUD/ReviewsDB/review.js";
import usersRouter from "./services/CRUD/usersDB/user.js";
import { authenticateDatabase } from "./utils/db/connect.js";

import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";
// import filesRouter from "./services/files/index.js"

import productsRouter from "./services/CRUD/ProductsDB/product.js";
const server = express();

const port = 3001;

server.use(cors());
server.use(express.json());

server.use("/users", usersRouter);
// server.use("/review", reviewsRouter);
server.use("/product", productsRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.table(listEndpoints(server));

server.listen(port, () => {
  authenticateDatabase();
  console.log(`Server is running on port ${port}`);
});
server.on("error", error => {
  console.log(`Server is stopped : ${error}`);
});
