require("dotenv").config();
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandle from "../utils/ErrorHandle";
import { redis } from "../utils/redis";
import { updateAccessToken } from "../controllers/user.controller";

//authenticated user
export const isAuthentication = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // let access_token = req.cookies.access_token;

    // if (!access_token) {
    //   access_token = req.headers["access-token"] as string;
    // }

    const access_token =
      req.cookies.access_token || req.headers["access-token"];

    if (!access_token) {
      return next(new ErrorHandle("Vui lòng đăng nhập để truy cập", 400));
    }

    const decoded = jwt.decode(access_token) as JwtPayload;
    if (!decoded) {
      return next(new ErrorHandle("access token không hợp lệ", 400));
    }

    // check if the access token is expired
    if (decoded.exp && decoded.exp <= Date.now() / 1000) {
      try {
        await updateAccessToken(req, res, next);
      } catch (error) {
        return next(error);
      }
    } else {
      const user = await redis.get(decoded.id);

      if (!user) {
        return next(
          new ErrorHandle("Vui lòng đăng nhập để truy cập", 400),
        );
      }

      req.user = JSON.parse(user);

      next();
    }
  },
);
// export const isAuthentication = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const access_token =
//       req.cookies.access_token || req.headers["access-token"];

//     if (!access_token) {
//       return next(new ErrorHandle("Please login to access this resource", 400));
//     }

//     try {
//       const decoded = jwt.verify(
//         access_token,
//         process.env.JWT_SECRET,
//       ) as JwtPayload;

//       const user = await redis.get(decoded.id);
//       if (!user) {
//         return next(
//           new ErrorHandle("Please login to access this resource", 400),
//         );
//       }

//       req.user = JSON.parse(user);
//       next();
//     } catch (error) {
//       if (error.name === "TokenExpiredError") {
//         await updateAccessToken(req, res, next);
//       } else {
//         return next(new ErrorHandle("access token is not valid", 400));
//       }
//     }
//   },
// );

//validate user role
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandle(
          `Role: ${req.user?.role} không được phép truy cập tài nguyên này`,
          403,
        ),
      );
    }
    next();
  };
};
