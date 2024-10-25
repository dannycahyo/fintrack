import { Hono } from "hono";
import transactionsRouter from "./routes/transactions";
import categoriesRouter from "./routes/categories";
import logger from "./logger";

const app = new Hono();

app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  logger.info(`${c.req.method} ${c.req.url} - ${ms}ms`);
});

app.get("/", (c) => {
  logger.info("GET /");
  return c.text("Welcome to Fin Track API");
});

app.route("/transactions", transactionsRouter);
app.route("/categories", categoriesRouter);

export default app;
