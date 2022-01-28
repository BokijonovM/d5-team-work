import { body } from "express-validator"

export const newProductValidation = [
  body("title").exists().withMessage("Title is a mandatory field!"),
  body("category").exists().withMessage("Category is a mandatory field!"),
]