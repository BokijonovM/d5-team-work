import express from "express";
import multer from "multer";
import { saveUsersAvatars } from "../../services/libs/fs-toolsReview.js";
const filesRouter = express.Router();
filesRouter.post(
  "/uploadSingleproduct",
  multer().single("avatar"),
  async (req, res, next) => {
    try {
      console.log("FILE: ", req.file);
      await saveUsersAvatars(req.file.originalname, req.file.buffer);
      res.send("Ok");
    } catch (error) {
      next(error);
    }
  }
);

export default filesRouter;
