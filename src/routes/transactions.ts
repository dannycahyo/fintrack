import { Hono } from "hono";
import { transactions } from "../mock/transaction";
import type { Transaction } from "../types/Transaction";

const transactionsRouter = new Hono();

transactionsRouter.get("/", (c) => {
  return c.json(transactions);
});

transactionsRouter.get("/:id", (c) => {
  const transaction = transactions.find(
    (t) => t.id === c.req.param("id"),
  );
  return transaction ? c.json(transaction) : c.notFound();
});

transactionsRouter.post("/", async (c) => {
  const newTransaction: Transaction = await c.req.json();
  newTransaction.id = "8f596aca-5c2d-4598-ba75-75d759afbdba";
  transactions.push(newTransaction);
  return c.json(newTransaction, 201);
});

transactionsRouter.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const updatedTransaction: Partial<Transaction> = await c.req.json();
  const updatedTransactions = transactions.map((t) =>
    t.id === id ? { ...t, ...updatedTransaction } : t,
  );
  const transaction = updatedTransactions.find((t) => t.id === id);
  return transaction ? c.json(transaction) : c.notFound();
});

transactionsRouter.delete("/:id", (c) => {
  const id = c.req.param("id");
  const index = transactions.findIndex((t) => t.id === id);
  if (index !== -1) {
    transactions.splice(index, 1);
    return c.text("Transaction deleted", 204);
  }
  return c.notFound();
});

export default transactionsRouter;
