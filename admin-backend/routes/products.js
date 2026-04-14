import * as z from "zod";
import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/products.js";
import validate from "../middlewares/validation.js";

const router = express.Router();

const productSchema = z.object({
  categoryId: z.string(),
  name: z.string().min(1),
  price: z.number().positive(),
  imageUrl: z.url().optional(),
  description: z.string().min(1),
});

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  imageUrl: z.url().optional(),
  description: z.string().min(1).optional(),
});

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", validate(productSchema), createProduct);
router.put("/:id", validate(updateProductSchema), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
