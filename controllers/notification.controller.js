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
exports.updateNotification = exports.getNotifications = void 0;
const notification_model_1 = __importDefault(require("../models/notification.model"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandle_1 = __importDefault(require("../utils/ErrorHandle"));
const node_cron_1 = __importDefault(require("node-cron"));
// get all Notification -- admin
exports.getNotifications = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield notification_model_1.default.find().sort({
            createdAt: -1,
        });
        res.status(201).json({
            success: true,
            notifications,
        });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandle_1.default(error.message, 400));
    }
}));
// update notification status -- admin
exports.updateNotification = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = yield notification_model_1.default.findById(req.params.id);
        if (!notification) {
            return next(new ErrorHandle_1.default("Không tìm thấy thông báo", 404));
        }
        else {
            notification.status
                ? (notification.status = "read")
                : notification === null || notification === void 0 ? void 0 : notification.status;
        }
        yield notification.save();
        const notifications = yield notification_model_1.default.find().sort({
            createdAt: -1,
        });
        res.status(201).json({
            success: true,
            notifications,
        });
    }
    catch (error) {
        return next(new ErrorHandle_1.default(error.message, 500));
    }
}));
// delete notification --- admin
// * * * * * *
// | | | | | |
// | | | | | +--- Day of the week (0 - 6) (Sunday to Saturday)
// | | | | +----- Month (1 - 12)
// | | | +------- Day of the month (1 - 31)
// | | +--------- Hour (0 - 23)
// | +----------- Minute (0 - 59)
// +------------- Second (0 - 59)
node_cron_1.default.schedule("0 0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    yield notification_model_1.default.deleteMany({
        status: "read",
        createdAt: { $lt: thirtyDaysAgo },
    });
    console.log("Đã xóa thông báo đã đọc");
}));
