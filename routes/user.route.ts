import express from "express";
import {
  activationUser,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken,
  updateAvatar,
  updatePassword,
  updateUserInfo,
} from "../controllers/user.controller";
import { isAuthentication } from "../middleware/auth";
const userRouter = express.Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activationUser);
userRouter.post("/login-user", loginUser);
userRouter.get("/logout-user", isAuthentication, logoutUser);
userRouter.get("/refresh", updateAccessToken);
userRouter.get("/me", isAuthentication, getUserInfo);
userRouter.post("/socialAuth", socialAuth);
userRouter.put("/update-user", isAuthentication, updateUserInfo);
userRouter.put("/update-user-password", isAuthentication, updatePassword);
userRouter.put("/update-user-avatar", isAuthentication, updateAvatar);

export default userRouter;
