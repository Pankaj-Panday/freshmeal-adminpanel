import express from "express";
import {
  getOrders,
  getUserOrders,
  getOrderById,
  updateOrder,
  createRazorPayOrder,
  createOrder,
} from "../controllers/orders.js";
import * as z from "zod";
import validate from "../middlewares/validation.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

const razorpaySchema = z.object({
  amount: z.number().positive(),
  currency: z.string(),
  receipt: z.string(),
});

const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      quantity: z.number().positive(),
      price: z.number().positive(),
    }),
  ),
  totalAmount: z.number().positive(),
  address: z.object({
    name: z.string(),
    mobile: z.string(),
    flatNo: z.string(),
    buildingName: z.string(),
    street: z.string(),
    landmark: z.string(),
    locality: z.string(),
    pincode: z.string(),
    type: z.string().optional(),
    id: z.string().optional(),
  }),
  paymentMethod: z.string(),
  paymentId: z.string().optional(),
  razorpayOrderId: z.string().optional(),
});

router.get("/", getOrders);
router.get("/my-orders", verifyToken, getUserOrders);
router.get("/:id", getOrderById);
router.put("/:id", verifyToken, updateOrder);
router.post(
  "/create-razorpay-order",
  verifyToken,
  validate(razorpaySchema),
  createRazorPayOrder,
);
router.post("/create-order", verifyToken, validate(orderSchema), createOrder);

export default router;
