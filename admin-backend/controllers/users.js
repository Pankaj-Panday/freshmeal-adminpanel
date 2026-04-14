import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getUsers(req, res) {
  const { page = 1, limit = 10 } = req.query;

  const pageNum = Math.max(parseInt(page) || 1, 1);
  const limitNum = Math.min(parseInt(limit) || 10, 50);
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limitNum,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
  ]);

  res.status(200).json({
    success: true,
    data: users,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
}

export { getUsers };
