import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
// import reviewRouter from "./services/CRUD/Reviews/review.js";

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

// server.use("/review", reviewRouter);
server.use("/products", productsRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.table(listEndpoints(server));

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
