import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      name: "Fruits & Vegetables",
      imageUrl: "https://images.unsplash.com/photo-1610348725531-843dff563e2c",
      products: [
        {
          name: "Apple",
          price: 120,
          imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6",
        },
        {
          name: "Banana",
          price: 50,
          imageUrl:
            "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e",
        },
        {
          name: "Tomato",
          price: 40,
          imageUrl:
            "https://images.unsplash.com/photo-1592928302636-c83cf1e1c887",
        },
        {
          name: "Potato",
          price: 35,
          imageUrl:
            "https://images.unsplash.com/photo-1518977676601-b53f82aba655",
        },
      ],
    },

    {
      name: "Dairy & Bakery",
      imageUrl: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec",
      products: [
        {
          name: "Milk",
          price: 60,
          imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b",
        },
        {
          name: "Bread",
          price: 40,
          imageUrl: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73",
        },
        {
          name: "Butter",
          price: 55,
          imageUrl:
            "https://plus.unsplash.com/premium_photo-1700088853545-e6529edb2d25",
        },
        {
          name: "Paneer",
          price: 90,
          imageUrl:
            "https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab",
        },
      ],
    },

    {
      name: "Atta, Rice & Dal",
      imageUrl: "https://images.unsplash.com/photo-1668337624325-e49fd5bf1446",
      products: [
        {
          name: "Basmati Rice",
          price: 120,
          imageUrl:
            "https://images.unsplash.com/photo-1723475158232-819e29803f4d",
        },
        {
          name: "Toor Dal",
          price: 140,
          imageUrl:
            "https://images.unsplash.com/photo-1615485290382-441e4d049cb5",
        },
        {
          name: "Moong Dal",
          price: 135,
          imageUrl:
            "https://images.unsplash.com/photo-1702041357314-db5826c96f04",
        },
        {
          name: "Wheat Atta",
          price: 220,
          imageUrl:
            "https://images.unsplash.com/photo-1602293589930-45aad59ba3ab",
        },
      ],
    },

    {
      name: "Oils & Ghee",
      imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5",
      products: [
        {
          name: "Sunflower Oil",
          price: 180,
          imageUrl:
            "https://images.unsplash.com/photo-1638324396229-632af05042dd",
        },
        {
          name: "Mustard Oil",
          price: 200,
          imageUrl:
            "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5",
        },
        {
          name: "Desi Ghee",
          price: 550,
          imageUrl:
            "https://images.unsplash.com/photo-1707424124274-689499bbe5e9",
        },
      ],
    },

    {
      name: "Snacks & Biscuits",
      imageUrl: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087",
      products: [
        {
          name: "Parle G",
          price: 10,
          imageUrl:
            "https://images.unsplash.com/photo-1585238342024-78d387f4a707",
        },
        {
          name: "Good Day Biscuit",
          price: 30,
          imageUrl:
            "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e",
        },
        {
          name: "Potato Chips",
          price: 20,
          imageUrl:
            "https://images.unsplash.com/photo-1566478989037-eec170784d0b",
        },
        {
          name: "Nachos",
          price: 50,
          imageUrl:
            "https://images.unsplash.com/photo-1599490659213-e2b9527bd087",
        },
      ],
    },

    {
      name: "Beverages",
      imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87",
      products: [
        {
          name: "Coca Cola",
          price: 40,
          imageUrl:
            "https://images.unsplash.com/photo-1622483767028-3f66f32aef97",
        },
        {
          name: "Orange Juice",
          price: 80,
          imageUrl:
            "https://images.unsplash.com/photo-1600271886742-f049cd451bba",
        },
        {
          name: "Mango Juice",
          price: 75,
          imageUrl:
            "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b",
        },
      ],
    },

    {
      name: "Instant Food",
      imageUrl: "https://images.unsplash.com/photo-1586816001966-79b736744398",
      products: [
        {
          name: "Maggi Noodles",
          price: 15,
          imageUrl:
            "https://images.unsplash.com/photo-1612927601601-6638404737ce",
        },
        {
          name: "Cup Noodles",
          price: 45,
          imageUrl:
            "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f",
        },
        {
          name: "Pasta",
          price: 90,
          imageUrl:
            "https://images.unsplash.com/photo-1608756687911-aa1599ab3bd9",
        },
      ],
    },
  ];

  for (const category of categories) {
    const createdCategory = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
        imageUrl: category.imageUrl,
      },
    });

    for (const product of category.products) {
      await prisma.product.upsert({
        where: {
          name_categoryId: {
            name: product.name,
            categoryId: createdCategory.id,
          },
        },
        update: {},
        create: {
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          categoryId: createdCategory.id,
        },
      });
    }
  }

  console.log("✅ Grocery database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
