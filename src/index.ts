import { Hono } from "hono";
import transactionsRouter from "./routes/transactions";
import categoriesRouter from "./routes/categories";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Welcome to Fin Track API");
});

app.route("/transactions", transactionsRouter);
app.route("/categories", categoriesRouter);

export default app;
