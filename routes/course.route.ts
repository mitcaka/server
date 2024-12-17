import express from "express";
import { authorizeRoles, isAuthentication } from "../middleware/auth";
import {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  editCourse,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  isAuthentication,
  authorizeRoles("admin"),
  uploadCourse
);

courseRouter.put(
  "/edit-course/:id",
  isAuthentication,
  authorizeRoles("admin"),
  editCourse
);

courseRouter.get("/get-course/:id", getSingleCourse);

courseRouter.get("/get-courses", getAllCourses);

courseRouter.get("/get-course-content/:id", isAuthentication, getCourseByUser);

courseRouter.put("/add-question", isAuthentication, addQuestion);

courseRouter.put("/add-answer", isAuthentication, addAnswer);

courseRouter.put("/add-review/:id", isAuthentication, addReview);

courseRouter.put(
  "/add-reply",
  isAuthentication,
  authorizeRoles("admin"),
  addReplyToReview
);

export default courseRouter;
