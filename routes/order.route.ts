import express from "express";
import { authorizeRoles, isAuthentication } from "../middleware/auth";
import {
  createOrder,
  getAllOrders,
  newPayment,
  sendStripePublishableKey,
  createMobileOrder,
} from "../controllers/order.controller";
const orderRouter = express.Router();

orderRouter.post("/create-order", isAuthentication, createOrder);

orderRouter.post("/create-mobile-order", isAuthentication, createMobileOrder);

orderRouter.get(
  "/get-orders",
  isAuthentication,
  authorizeRoles("admin"),
  getAllOrders,
);

orderRouter.get("/payment/stripepublishablekey", sendStripePublishableKey);

orderRouter.post("/payment", isAuthentication, newPayment);

export default orderRouter;
