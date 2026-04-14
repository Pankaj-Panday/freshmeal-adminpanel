import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getCategories(req, res) {
  const { page = 1, limit = 10 } = req.query;

  const pageNum = Math.max(parseInt(page) || 1, 1);
  const limitNum = Math.min(parseInt(limit) || 10, 50);
  const skip = (pageNum - 1) * limitNum;

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      skip,
      take: limitNum,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.count(),
  ]);

  res.status(200).json({
    success: true,
    data: categories,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
}

async function getCategoryById(req, res) {
  const { id } = req.params;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  res.status(200).json({
    success: true,
    data: category,
  });
}

async function getProductsByCategory(req, res) {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const pageNum = Math.max(parseInt(page) || 1, 1);
  const limitNum = Math.min(parseInt(limit) || 10, 50);
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        categoryId: id,
      },
      skip,
      take: limitNum,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({
      where: {
        categoryId: id,
      },
    }),
  ]);

  res.status(200).json({
    success: true,
    data: products,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
}

async function createCategory(req, res) {
  const { name, imageUrl } = req.body;

  const existing = await prisma.category.findUnique({
    where: { name },
  });

  if (existing) {
    return res.status(409).json({
      success: false,
      message: "Category already exists",
    });
  }

  const category = await prisma.category.create({
    data: {
      name,
      imageUrl,
    },
  });

  res.status(201).json({
    success: true,
    data: category,
  });
}

async function updateCategory(req, res) {
  const { id } = req.params;
  const { name, imageUrl } = req.body;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: {
      name,
      imageUrl,
    },
  });

  res.status(200).json({
    success: true,
    data: updatedCategory,
  });
}

async function deleteCategory(req, res) {
  const { id } = req.params;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  await prisma.$transaction([
    prisma.product.deleteMany({ where: { categoryId: id } }),
    prisma.category.delete({ where: { id } }),
  ]);

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
}

export {
  getCategories,
  getCategoryById,
  getProductsByCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
