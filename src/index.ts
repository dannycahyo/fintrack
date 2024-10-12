import { Hono } from "hono";
import transactionsRouter from "./routes/transactions";
import categoriesRouter from "./routes/categories";
import client from "./db";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Welcome to Fin Track API");
});

app.get("/test-db", async (c) => {
  try {
    const res = await client.query("SELECT NOW()");
    return c.json({
      message: "Connected to PostgreSQL",
      time: res.rows[0].now,
    });
  } catch (err) {
    return c.json(
      {
        message: "Failed to connect to PostgreSQL",
        error: (err as Error).message,
      },
      500,
    );
  }
});

app.route("/transactions", transactionsRouter);
app.route("/categories", categoriesRouter);

export default app;
