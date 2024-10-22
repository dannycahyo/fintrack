import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.createMany({
    data: [
      { id: "1", name: "Groceries" },
      { id: "2", name: "Utilities" },
      { id: "3", name: "Entertainment" },
    ],
  });

  console.log(`Seeded ${categories.count} categories.`);

  const transactions = await prisma.transaction.createMany({
    data: [
      {
        id: "1",
        amount: 100.0,
        type: "EXPENSE",
        categoryId: "1",
        date: new Date("2023-01-01T00:00:00Z"),
      },
      {
        id: "2",
        amount: 200.0,
        type: "INCOME",
        categoryId: "2",
        date: new Date("2023-02-01T00:00:00Z"),
      },
      {
        id: "3",
        amount: 50.0,
        type: "EXPENSE",
        categoryId: "3",
        date: new Date("2023-03-01T00:00:00Z"),
      },
    ],
  });

  console.log(`Seeded ${transactions.count} transactions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
