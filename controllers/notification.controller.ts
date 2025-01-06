import NotificationModel from "../models/notification.model";
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandle from "../utils/ErrorHandle";
import cron from "node-cron";

// get all Notification -- admin
export const getNotifications = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });

      res.status(201).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandle(error.message, 400));
    }
  }
);

// update notification status -- admin
export const updateNotification = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await NotificationModel.findById(req.params.id);
      if (!notification) {
        return next(new ErrorHandle("Không tìm thấy thông báo", 404));
      } else {
        notification.status
          ? (notification.status = "read")
          : notification?.status;
      }

      await notification.save();

      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });

      res.status(201).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 500));
    }
  }
);

// delete notification --- admin
// * * * * * *
// | | | | | |
// | | | | | +--- Day of the week (0 - 6) (Sunday to Saturday)
// | | | | +----- Month (1 - 12)
// | | | +------- Day of the month (1 - 31)
// | | +--------- Hour (0 - 23)
// | +----------- Minute (0 - 59)
// +------------- Second (0 - 59)
cron.schedule("0 0 0 * * *", async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await NotificationModel.deleteMany({
    status: "read",
    createdAt: { $lt: thirtyDaysAgo },
  });
  console.log("Đã xóa thông báo đã đọc");
});
