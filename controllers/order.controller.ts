import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandle from "../utils/ErrorHandle";
import userModel from "../models/user.model";
import CourseModel, { ICourse } from "../models/course.model";
import OrderModel, { IOrder } from "../models/order.model";
import sendMail from "../utils/sendEmail";
import NotificationModel from "../models/notification.model";
import path from "path";
import ejs from "ejs";
import { redis } from "../utils/redis";
import { getAllOrdersService, newOrder } from "../services/order.service";
require("dotenv").config();

//create order
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;
      const user = await userModel.findById(req.user?._id);
      const courseExistInUser = await user?.courses.some(
        (course: any) => course._id.toString() === courseId
      );

      if (courseExistInUser) {
        new ErrorHandle("You have already purchased this course", 400);
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandle("Course not found", 404));
      }

      const data: any = {
        courseId: course._id,
        userId: user?._id,
        payment_info,
      };

      const course_id = course._id as any;
      const mailData = {
        order: {
          _id: course_id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandle(error.message, 500));
      }

      user?.courses.push(course?._id as any);

      await redis.set(req.user?._id as any, JSON.stringify(user));

      await user?.save();

      await NotificationModel.create({
        user: user?._id,
        title: "New Order",
        message: `You have a new order from ${course?.name}`,
      });

      course.purchased = course.purchased + 1;

      await course.save();

      newOrder(data, res, next);
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandle(error.message, 400));
    }
  }
);

// get All orders --- admin
export const getAllOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandle(error.message, 500));
    }
  }
);
