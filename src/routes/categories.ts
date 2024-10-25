import { Hono } from "hono";
import * as categoryRepo from "../repository/categoryRepo";
import { CategorySchema } from "../types/Category";
import logger from "../logger";

import type { Category } from "../types/Category";

const categoriesRouter = new Hono();

categoriesRouter.get("/", async (c) => {
  const categories = await categoryRepo.getCategories();
  return c.json({ data: categories });
});

categoriesRouter.get("/:id", async (c) => {
  try {
    const category = await categoryRepo.getCategoryById(
      c.req.param("id"),
    );
    return category ? c.json({ data: category }) : c.notFound();
  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        `GET /categories/${c.req.param("id")} - ${error.message}`,
      );
      return c.json({ error: error.message }, 400);
    }
    logger.error(
      `GET /categories/${c.req.param("id")} - Unknown error`,
    );
    return c.json({ error: "Unknown error" }, 400);
  }
});

categoriesRouter.post("/", async (c) => {
  try {
    const newCategory: Category = CategorySchema.parse(
      await c.req.json(),
    );
    const createdCategory = await categoryRepo.createCategory(
      newCategory,
    );
    return c.json({ data: createdCategory }, 201);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`POST /categories - ${error.message}`);
      return c.json({ error: error.message }, 400);
    }
    logger.error(`POST /categories - Unknown error`);
    return c.json({ error: "Unknown error" }, 400);
  }
});

categoriesRouter.patch("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const updatedCategory: Partial<Category> =
      CategorySchema.partial().parse(await c.req.json());
    const category = await categoryRepo.updateCategory(
      id,
      updatedCategory,
    );
    return category
      ? c.json({ data: category })
      : c.json({ error: "Category not found" }, 422);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`PATCH /categories/${id} - ${error.message}`);
      return c.json({ error: error.message }, 400);
    }
    logger.error(`PATCH /categories/${id} - Unknown error`);
    return c.json({ error: "Unknown error" }, 400);
  }
});

categoriesRouter.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const category = await categoryRepo.deleteCategory(id);
    return category ? c.text("Category deleted", 204) : c.notFound();
  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        `DELETE /categories/${c.req.param("id")} - ${error.message}`,
      );
      return c.json({ error: error.message }, 400);
    }
    logger.error(
      `DELETE /categories/${c.req.param("id")} - Unknown error`,
    );
    return c.json({ error: "Unknown error" }, 400);
  }
});

export default categoriesRouter;
