import { Hono } from "hono";
import * as categoryRepo from "../repository/categoryRepo";
import { CategorySchema } from "../types/Category";
import logger from "../logger";
import { parse } from "csv-parse";

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

categoriesRouter.post("/upload", async (c) => {
  const formData = await c.req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return c.json({ error: "File is required" }, 400);
  }

  const categories: Category[] = [];
  const parser = parse({ columns: true });

  const readableStream = file.stream();
  const reader = readableStream.getReader();
  const stream = new ReadableStream({
    async start(controller) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        controller.enqueue(value);
      }
      controller.close();
    },
  });
  const nodeStream = require("stream").Readable.from(stream);
  nodeStream.pipe(parser);

  for await (const record of parser) {
    const newCategory: Category = {
      id: undefined,
      name: record.name,
    };
    categories.push(newCategory);
  }

  try {
    await categoryRepo.bulkCreateCategories(categories);
    return c.json(
      { message: "Categories uploaded successfully" },
      201,
    );
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`POST /categories/upload - ${error.message}`);
      return c.json({ error: error.message }, 500);
    }
    logger.error(`POST /categories/upload - Unknown error`);
    return c.json({ error: "Unknown error" }, 500);
  }
});

export default categoriesRouter;
