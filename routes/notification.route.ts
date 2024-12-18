import express from "express";
import { authorizeRoles, isAuthentication } from "../middleware/auth";
import {
  getNotifications,
  updateNotification,
} from "../controllers/notification.controller";

const notificationRouter = express.Router();

notificationRouter.get(
  "/get-all-notifications",
  isAuthentication,
  authorizeRoles("admin"),
  getNotifications
);
notificationRouter.put(
  "/update-notification/:id",
  isAuthentication,
  authorizeRoles("admin"),
  updateNotification
);
export default notificationRouter;
