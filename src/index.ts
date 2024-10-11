import { Hono } from "hono";

import { transactions } from "./mock/transaction";
import { categories } from "./mock/category";

import type { Category } from "./types/Category";
import type { Transaction } from "./types/Transaction";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Welcome to Fin Track API");
});

app.get("/transactions", (c) => {
  return c.json(transactions);
});

app.get("/transactions/:id", (c) => {
  const transaction = transactions.find(
    (t) => t.id === c.req.param("id"),
  );
  return transaction ? c.json(transaction) : c.notFound();
});

app.post("/transactions", async (c) => {
  const newTransaction: Transaction = await c.req.json();
  newTransaction.id = "8f596aca-5c2d-4598-ba75-75d759afbdba";
  transactions.push(newTransaction);
  return c.json(newTransaction, 201);
});

app.patch("/transactions/:id", async (c) => {
  const id = c.req.param("id");
  const updatedTransaction: Partial<Transaction> = await c.req.json();
  const updatedTransactions = transactions.map((t) =>
    t.id === id ? { ...t, ...updatedTransaction } : t,
  );
  const transaction = updatedTransactions.find((t) => t.id === id);
  return transaction ? c.json(transaction) : c.notFound();
});

app.delete("/transactions/:id", (c) => {
  const id = c.req.param("id");
  const index = transactions.findIndex((t) => t.id === id);
  if (index !== -1) {
    transactions.splice(index, 1);
    return c.text("Transaction deleted", 204);
  }
  return c.notFound();
});

// Categories Endpoints
app.get("/categories", (c) => {
  return c.json(categories);
});

app.get("/categories/:id", (c) => {
  const id = c.req.param("id");
  const category = categories.find((c) => c.id === id);
  return category ? c.json(category) : c.notFound();
});

app.post("/categories", async (c) => {
  const newCategory: Category = await c.req.json();
  newCategory.id = "1911c9ba-d2a4-4471-b66a-688ab4a522b9";
  categories.push(newCategory);
  return c.json(newCategory, 201);
});

app.patch("/categories/:id", async (c) => {
  const id = c.req.param("id");
  const updatedCategory: Partial<Category> = await c.req.json();
  categories.forEach((category, index) => {
    if (category.id === id) {
      categories[index] = { ...category, ...updatedCategory };
    }
  });
  const category = categories.find((c) => c.id === id);
  return category ? c.json(category) : c.notFound();
});

app.delete("/categories/:id", (c) => {
  const id = c.req.param("id");
  const index = categories.findIndex((c) => c.id === id);
  if (index !== -1) {
    categories.splice(index, 1);
  }
  return c.text("Category deleted", 204);
});

export default app;
