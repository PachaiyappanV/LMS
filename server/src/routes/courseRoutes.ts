import express from "express";
import multer from "multer";
import {
  createCourse,
  deleteCourse,
  getCourse,
  getCourses,
  updateCourse,
} from "../controllers/courseController";
import { requireAuth } from "@clerk/express";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getCourses);
router.post("/", requireAuth(), createCourse);

router.get("/:courseId", getCourse);
router.put("/:courseId", requireAuth(), upload.single("image"), updateCourse);
router.delete("/:courseId", requireAuth(), deleteCourse);

export default router;
