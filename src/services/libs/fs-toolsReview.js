import fs from "fs-extra";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../CRUD/Data"
);
const usersPublicFolderPath = join(process.cwd(), "./public/img");

const postsJSONPath = join(dataFolderPath, "reviews.json");

export const getReview = () => readJSON(postsJSONPath);
export const writeReview = content => writeJSON(postsJSONPath, content);

export const saveUsersAvatars = (filename, contentAsABuffer) =>
  writeFile(join(usersPublicFolderPath, filename), contentAsABuffer);
