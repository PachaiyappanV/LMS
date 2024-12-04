import express from "express";
import { getCourse, listCourses } from "../controllers/courseController";

const router = express.Router();

router.route("/").get(listCourses);
router.route("/:courseId").get(getCourse);

export default router;
