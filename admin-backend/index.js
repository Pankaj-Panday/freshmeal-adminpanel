import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
import categoryRoutes from "./routes/categories.js";
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";
import userRoutes from "./routes/users.js";
import bodyParser from "body-parser";
import logger from "./utils/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import { PrismaClient } from "@prisma/client";

const app = express();

const prisma = new PrismaClient();

// webhook route - razorpay
app.post(
  "/api/v1/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["x-razorpay-signature"];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    try {
      const shasum = crypto.createHmac("sha256", webhookSecret);
      shasum.update(req.body);
      const digest = shasum.digest("hex");

      if (digest === signature) {
        const event = JSON.parse(req.body.toString());

        if (event.event === "payment.captured") {
          const { order_id, payment_id } = event.payload.payment.entity;
          await prisma.order.update({
            where: {
              razorpayOrderId: order_id,
            },
            data: {
              paymentId: payment_id,
              status: "PAID",
            },
          });
        }
        res.status(200).json({
          success: true,
          message: "Webhook processed successfully",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid webhook signature",
        });
      }
    } catch (error) {
      logger.error("Webhook error:", error);
      res.status(500).json({
        success: false,
        message: "Webhook processing failed",
      });
    }
  },
);

// normal APIs
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/users", userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
