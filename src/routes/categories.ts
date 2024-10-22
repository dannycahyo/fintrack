import { Hono } from "hono";
import prisma from "../db";
import type { Category } from "../types/Category";

const categoriesRouter = new Hono();

categoriesRouter.get("/", async (c) => {
  const categories = await prisma.category.findMany();
  return c.json({ data: categories });
});

categoriesRouter.get("/:id", async (c) => {
  const category = await prisma.category.findUnique({
    where: { id: c.req.param("id") },
  });
  return category ? c.json({ data: category }) : c.notFound();
});

categoriesRouter.post("/", async (c) => {
  const newCategory: Category = await c.req.json();
  const createdCategory = await prisma.category.create({
    data: newCategory,
  });
  return c.json({ data: createdCategory }, 201);
});

categoriesRouter.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const updatedCategory: Partial<Category> = await c.req.json();
  const category = await prisma.category.update({
    where: { id },
    data: updatedCategory,
  });
  return category ? c.json({ data: category }) : c.notFound();
});

categoriesRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    await prisma.category.delete({
      where: { id },
    });
    return c.text("Category deleted", 204);
  } catch (error) {
    return c.notFound();
  }
});

export default categoriesRouter;
