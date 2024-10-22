import { Hono } from "hono";
import transactionsRouter from "./routes/transactions";
import categoriesRouter from "./routes/categories";
import { handle } from "@hono/node-server/vercel";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Welcome to Fin Track API");
});

app.route("/transactions", transactionsRouter);
app.route("/categories", categoriesRouter);

export default handle(app);
