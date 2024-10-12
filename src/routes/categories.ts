import { Hono } from "hono";
import { categories } from "../mock/category";
import type { Category } from "../types/Category";

const categoriesRouter = new Hono();

categoriesRouter.get("/", (c) => {
  return c.json(categories);
});

categoriesRouter.get("/:id", (c) => {
  const id = c.req.param("id");
  const category = categories.find((c) => c.id === id);
  return category ? c.json(category) : c.notFound();
});

categoriesRouter.post("/", async (c) => {
  const newCategory: Category = await c.req.json();
  newCategory.id = "1911c9ba-d2a4-4471-b66a-688ab4a522b9";
  categories.push(newCategory);
  return c.json(newCategory, 201);
});

categoriesRouter.patch("/:id", async (c) => {
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

categoriesRouter.delete("/:id", (c) => {
  const id = c.req.param("id");
  const index = categories.findIndex((c) => c.id === id);
  if (index !== -1) {
    categories.splice(index, 1);
  }
  return c.text("Category deleted", 204);
});

export default categoriesRouter;
