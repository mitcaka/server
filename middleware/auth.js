"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.isAuthentication = void 0;
require("dotenv").config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsyncErrors_1 = require("./catchAsyncErrors");
const ErrorHandle_1 = __importDefault(require("../utils/ErrorHandle"));
const redis_1 = require("../utils/redis");
const user_controller_1 = require("../controllers/user.controller");
//authenticated user
exports.isAuthentication = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req.cookies.access_token || req.headers["access-token"];
    if (!access_token) {
        return next(new ErrorHandle_1.default("Vui lòng đăng nhập để truy cập", 400));
    }
    const decoded = jsonwebtoken_1.default.decode(access_token);
    if (!decoded) {
        return next(new ErrorHandle_1.default("access token không hợp lệ", 400));
    }
    // check if the access token is expired
    if (decoded.exp && decoded.exp <= Date.now() / 1000) {
        try {
            console.log("đang update token");
            yield (0, user_controller_1.updateAccessToken)(req, res, next);
        }
        catch (error) {
            return next(error);
        }
    }
    else {
        const user = yield redis_1.redis.get(decoded.id);
        if (!user) {
            return next(new ErrorHandle_1.default("Vui lòng đăng nhập để truy cập", 400));
        }
        req.user = JSON.parse(user);
        next();
    }
}));
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
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        var _a, _b;
        if (!roles.includes(((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) || "")) {
            return next(new ErrorHandle_1.default(`Role: ${(_b = req.user) === null || _b === void 0 ? void 0 : _b.role} không được phép truy cập tài nguyên này`, 403));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
