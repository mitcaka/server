import express from "express";
import { authorizeRoles, isAuthentication } from "../middleware/auth";
import {
  createLayout,
  editLayout,
  getLayoutByType,
} from "../controllers/layout.controller";
const layoutRouter = express.Router();

layoutRouter.post(
  "/create-layout",
  isAuthentication,
  authorizeRoles("admin"),
  createLayout
);

layoutRouter.put(
  "/edit-layout",
  isAuthentication,
  authorizeRoles("admin"),
  editLayout
);

layoutRouter.get("/get-layout/:type", getLayoutByType);

export default layoutRouter;
