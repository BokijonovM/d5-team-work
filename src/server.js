import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import reviewRouter from "./services/CRUD/Reviews/review.js";
import productsRouter from "./services/CRUD/Products/product.js";
const server = express();

const port = 3001;

server.use(cors());
server.use(express.json());

server.use("/review", reviewRouter);
server.use("/products", productsRouter);

console.table(listEndpoints(server));

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
