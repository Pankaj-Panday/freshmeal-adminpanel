import express from "express";
import * as z from "zod";
import validate from "../middlewares/validation.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getProductsByCategory,
  updateCategory,
  getCategoryById,
} from "../controllers/categories.js";

const router = express.Router();

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  imageUrl: z.url("Invalid image URL").optional().or(z.literal("")),
});

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.get("/:id/products", getProductsByCategory);
router.post("/", validate(categorySchema), createCategory);
router.put("/:id", validate(categorySchema), updateCategory);
router.delete("/:id", deleteCategory);

export default router;
