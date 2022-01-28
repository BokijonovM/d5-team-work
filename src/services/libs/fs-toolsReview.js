import fs from "fs-extra";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../CRUD/Data"
);
const usersPublicFolderPath = join(process.cwd(), "./public/img/products");

const productsJSONPath = join(dataFolderPath, "products.json");
const postsJSONPath = join(dataFolderPath, "reviews.json");

export const getReview = () => readJSON(postsJSONPath);
export const writeReview = (content) => writeJSON(postsJSONPath, content);
export const getProducts = () => readJSON(productsJSONPath);
export const writeProducts = (content) => writeJSON(productsJSONPath, content);

export const saveUsersAvatars = (filename, contentAsABuffer) =>
  writeFile(join(usersPublicFolderPath, filename), contentAsABuffer);
