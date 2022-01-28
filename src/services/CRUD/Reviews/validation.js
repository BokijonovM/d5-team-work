import { checkSchema, validationResult } from "express-validator";

const schema = {
  comment: {
    in: ["body"],
    isString: {
      errorMessage: "Comment validation failed , type must be string  ",
    },
  },
  rate: {
    in: ["body"],
    isString: {
      errorMessage: "Rate validation failed , type must be  string ",
    },
  },
};
const searchSchema = {
  comment: {
    in: ["query"],
    isString: {
      errorMessage:
        "Comment must be in query and type must be  string to search!",
    },
  },
};

export const checkSearchSchema = checkSchema(searchSchema);
export const checkBlogPostSchema = checkSchema(schema);

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Blog post validation is failed");
    error.status = 400;
    error.errors = errors.array();
    next(error);
  }
  next();
};
