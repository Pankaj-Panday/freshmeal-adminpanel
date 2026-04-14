import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getProducts(req, res) {
  const { categoryId, page = 1, limit = 10 } = req.query;

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const where = categoryId ? { categoryId } : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.product.count({ where }),
  ]);

  return res.status(200).json({
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

async function getProductById(req, res) {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: product,
  });
}

async function createProduct(req, res) {
  const { name, price, imageUrl, description, categoryId } = req.body;

  const product = await prisma.product.create({
    data: {
      name,
      price,
      imageUrl,
      description,
      categoryId,
    },
  });

  return res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, price, imageUrl, description } = req.body;

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      price,
      imageUrl,
      description,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
}

async function deleteProduct(req, res) {
  const { id } = req.params;

  await prisma.product.delete({
    where: { id },
  });

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
}

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
