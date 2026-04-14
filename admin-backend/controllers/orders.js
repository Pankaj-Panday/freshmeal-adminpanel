import Razorpay from "razorpay";
import PDFDocument from "pdfkit";
import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";
import { sendMailWithRetry } from "../utils/emailQueue.js";

const prisma = new PrismaClient();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function getOrders(req, res) {
  const { page = 1, limit = 10 } = req.query;

  const pageNum = Math.max(parseInt(page) || 1, 1);
  const limitNum = Math.min(parseInt(limit) || 10, 50);
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      include: {
        user: true,
      },
      skip,
      take: limitNum,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count(),
  ]);

  res.status(200).json({
    success: true,
    data: orders,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
}

async function getUserOrders(req, res) {
  const userId = req.user.userId;
  const { page = 1, limit = 10 } = req.query;

  const pageNum = Math.max(parseInt(page) || 1, 1);
  const limitNum = Math.min(parseInt(limit) || 10, 50);
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: {
        userId: userId,
      },
      skip,
      take: limitNum,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({
      where: {
        userId: userId,
      },
    }),
  ]);

  res.status(200).json({
    success: true,
    data: orders,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
}

async function getOrderById(req, res) {
  const { id } = req.params;

  const order = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  res.status(200).json({
    success: true,
    data: order,
  });
}

async function updateOrder(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const order = await prisma.order.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  res.status(200).json({
    success: true,
    data: order,
  });
}

async function createRazorPayOrder(req, res) {
  const { amount, currency, receipt } = req.body;

  const order = await razorpay.orders.create({
    amount,
    currency,
    receipt,
  });

  res.status(200).json({
    success: true,
    data: order,
  });
}

async function createOrder(req, res) {
  try {
    const userId = req.user.userId;

    const {
      items,
      totalAmount,
      address,
      paymentMethod,
      paymentId,
      razorpayOrderId,
    } = req.body;

    const order = await prisma.order.create({
      data: {
        items,
        totalAmount,
        address,
        paymentMethod,
        paymentId,
        status: paymentMethod === "COD" ? "PENDING" : "PAID",
        razorpayOrderId,
        user: {
          connect: { id: userId },
        },
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // -------- PDF GENERATION --------
    const pdfDoc = new PDFDocument();
    const buffers = [];

    pdfDoc.on("data", (chunk) => buffers.push(chunk));

    pdfDoc.on("end", async () => {
      const pdfBuffer = Buffer.concat(buffers);

      try {
        await sendMailWithRetry({
          to: user.email,
          subject: "Order Confirmation",
          text: "Your order has been placed successfully!",
          attachments: [
            {
              filename: `invoice_${order.id}.pdf`,
              content: pdfBuffer,
              contentType: "application/pdf",
            },
          ],
        });
      } catch (err) {
        logger.error("Failed to send order email:", err);
      }

      return res.status(200).json({
        success: true,
        message: "Order created successfully",
        data: order,
      });
    });

    // -------- PDF CONTENT --------

    pdfDoc.fontSize(22).text("Invoice", { align: "center" });

    pdfDoc.moveDown();

    pdfDoc.fontSize(12);

    pdfDoc.text(`Order ID: ${order.id}`);
    pdfDoc.text(`Customer: ${user?.name || "Valued Customer"}`);
    pdfDoc.text(`Email: ${user?.email || "N/A"}`);

    const formattedAddress =
      typeof address === "object"
        ? `${address.name}
${address.mobile}
${address.flatNo}, ${address.buildingName}
${address.street}, ${address.landmark}
${address.locality} - ${address.pincode}`
        : address;

    pdfDoc.text("Delivery Address:");
    pdfDoc.text(formattedAddress);

    pdfDoc.moveDown();
    pdfDoc.text("Items:");

    items.forEach((item, index) => {
      pdfDoc.text(
        `${index + 1}. ${item.name} | Qty: ${item.quantity} | Rs ${item.price}`,
      );
    });

    pdfDoc.moveDown();
    pdfDoc.text(`Total Amount: Rs ${totalAmount}`);
    pdfDoc.moveDown();
    pdfDoc.text(`Payment Method: ${paymentMethod}`);
    pdfDoc.moveDown();
    pdfDoc.text("Thank you for your order!", { align: "center" });
    pdfDoc.end();
  } catch (error) {
    logger.error("Order creation failed:", error);

    res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
}

export {
  getOrders,
  getUserOrders,
  getOrderById,
  updateOrder,
  createRazorPayOrder,
  createOrder,
};
