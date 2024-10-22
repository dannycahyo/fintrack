import { Hono } from "hono";
import prisma from "../db";
import type { Transaction } from "../types/Transaction";

const transactionsRouter = new Hono();

transactionsRouter.get("/", async (c) => {
  const transactions = await prisma.transaction.findMany();
  return c.json({ data: transactions });
});

transactionsRouter.get("/:id", async (c) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: c.req.param("id") },
  });
  return transaction ? c.json({ data: transaction }) : c.notFound();
});

transactionsRouter.post("/", async (c) => {
  const newTransaction: Transaction = await c.req.json();
  const createdTransaction = await prisma.transaction.create({
    data: {
      ...newTransaction,
      category: { connect: { id: newTransaction.category } },
    },
  });
  return c.json({ data: createdTransaction }, 201);
});

transactionsRouter.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const updatedTransaction: Partial<Transaction> = await c.req.json();
  const transaction = await prisma.transaction.update({
    where: { id },
    data: {
      ...updatedTransaction,
      category: updatedTransaction.category
        ? { connect: { id: updatedTransaction.category } }
        : undefined,
    },
  });
  return transaction ? c.json({ data: transaction }) : c.notFound();
});

transactionsRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    await prisma.transaction.delete({
      where: { id },
    });
    return c.text("Transaction deleted", 204);
  } catch (error) {
    return c.notFound();
  }
});

export default transactionsRouter;
