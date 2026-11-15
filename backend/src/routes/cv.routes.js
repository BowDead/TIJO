import { Router } from "express";
import { uploadCvFile } from "../middlewares/upload.middleware.js";
import {
  postParseCv,
  postAnonymizeCv,
  postAtsScore,
} from "../controllers/cv.controller.js";

export const cvRouter = Router();

cvRouter.post("/parse", uploadCvFile, postParseCv);
cvRouter.post("/anonymize", postAnonymizeCv);
cvRouter.post("/ats-score", postAtsScore);
