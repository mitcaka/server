import express from "express";
import {
  activationUser,
  deleteUser,
  getAllUsers,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken,
  updateAvatar,
  updatePassword,
  updateUserInfo,
  updateUserRole,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthentication } from "../middleware/auth";
const userRouter = express.Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activationUser);
userRouter.post("/login-user", loginUser);
userRouter.get("/logout-user", isAuthentication, logoutUser);
userRouter.get("/refresh", updateAccessToken);
userRouter.get("/me", isAuthentication, getUserInfo);
userRouter.post("/social-auth", socialAuth);
userRouter.put("/update-user-info", isAuthentication, updateUserInfo);
userRouter.put("/update-user-password", isAuthentication, updatePassword);
userRouter.put("/update-user-avatar", isAuthentication, updateAvatar);
userRouter.get(
  "/get-users",
  isAuthentication,
  authorizeRoles("admin"),
  getAllUsers
);

userRouter.put(
  "/admin-update-user",
  isAuthentication,
  authorizeRoles("admin"),
  updateUserRole
);

userRouter.delete(
  "/delete-user/:id",
  isAuthentication,
  authorizeRoles("admin"),
  deleteUser
);

export default userRouter;
