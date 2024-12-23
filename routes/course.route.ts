import express from "express";
import { authorizeRoles, isAuthentication } from "../middleware/auth";
import {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  generateVideoUrl,
  getAdminAllCourses,
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

courseRouter.get(
  "/get-admin-courses",
  isAuthentication,
  authorizeRoles("admin"),
  getAdminAllCourses
);

courseRouter.delete(
  "/delete-course/:id",
  isAuthentication,
  authorizeRoles("admin"),
  deleteCourse
);

courseRouter.post("/getVdoCipherOTP", generateVideoUrl);

export default courseRouter;
