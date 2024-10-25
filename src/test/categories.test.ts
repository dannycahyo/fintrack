import {
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import * as categoryRepo from "../repository/categoryRepo";
import app from "../index";

import type { Category } from "../types/Category";

beforeEach(() => {
  mock.restore();
});

const mockedCategory: Category = {
  id: "1",
  name: "Test Category",
};

const validNewCategory = { name: "New Category" };
const invalidNewCategory = { name: "" };

const headers: HeadersInit = {
  "content-type": "application/json",
};

describe("GET /categories", () => {
  it("should return list of categories", async () => {
    spyOn(categoryRepo, "getCategories").mockResolvedValue([
      mockedCategory,
    ]);

    const res = await app.request("/categories");

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toHaveLength(1);
    expect(body.data).toHaveProperty("0.id", mockedCategory.id);
  });

  it("should return empty list when there are no categories", async () => {
    spyOn(categoryRepo, "getCategories").mockResolvedValue([]);

    const res = await app.request("/categories");

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toHaveLength(0);
  });
});

describe("POST /categories", () => {
  it("should create new category", async () => {
    const mockedSetCategories = spyOn(
      categoryRepo,
      "createCategory",
    ).mockResolvedValue(mockedCategory);

    const res = await app.request("/categories", {
      method: "POST",
      headers,
      body: JSON.stringify(validNewCategory),
    });

    expect(res.status).toBe(201);
    expect(mockedSetCategories).toHaveBeenCalled();
  });

  it("should return error when new category is invalid", async () => {
    const mockedSetCategories = spyOn(
      categoryRepo,
      "createCategory",
    ).mockResolvedValue(mockedCategory);

    const res = await app.request("/categories", {
      method: "POST",
      headers,
      body: JSON.stringify(invalidNewCategory),
    });

    expect(res.status).toBe(400);
    expect(mockedSetCategories).not.toHaveBeenCalled();
  });
});

describe("GET /categories/:id", () => {
  it("should return details of category", async () => {
    const mockedGetCategoryById = spyOn(
      categoryRepo,
      "getCategoryById",
    ).mockResolvedValue(mockedCategory);
    const res = await app.request("/categories/1");

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toHaveProperty("id", mockedCategory.id);
    expect(mockedGetCategoryById).toHaveBeenCalledWith("1");
  });

  it("should return error when category does not exist", async () => {
    const mockedGetCategoryById = spyOn(
      categoryRepo,
      "getCategoryById",
    ).mockResolvedValue(null);
    const res = await app.request("/categories/999");

    expect(res.status).toBe(404);
    expect(mockedGetCategoryById).toHaveBeenCalledWith("999");
  });
});

describe("PATCH /categories/:id", () => {
  it("should update and return new details of category", async () => {
    const mockedUpdateCategory = spyOn(
      categoryRepo,
      "updateCategory",
    ).mockResolvedValue(mockedCategory);
    const res = await app.request("/categories/1", {
      method: "PATCH",
      headers,
      body: JSON.stringify(validNewCategory),
    });

    expect(res.status).toBe(200);
    expect(mockedUpdateCategory).toBeCalledWith(
      "1",
      validNewCategory,
    );
  });

  it("should err when updated category is invalid", async () => {
    const mockedUpdateCategory = spyOn(
      categoryRepo,
      "updateCategory",
    ).mockResolvedValue(mockedCategory);
    const res = await app.request("/categories/1", {
      method: "PATCH",
      headers,
      body: JSON.stringify(invalidNewCategory),
    });

    expect(res.status).toBe(400);
    expect(mockedUpdateCategory).not.toBeCalled();
  });

  it("should return error when updated category does not exist", async () => {
    const mockedUpdateCategory = spyOn(
      categoryRepo,
      "updateCategory",
    ).mockResolvedValue(null);
    const res = await app.request("/categories/999", {
      method: "PATCH",
      headers,
      body: JSON.stringify(validNewCategory),
    });

    expect(res.status).toBe(422);
    expect(mockedUpdateCategory).toBeCalledWith(
      "999",
      validNewCategory,
    );
  });

  it("should return error when database update failed", async () => {
    const mockedUpdateCategory = spyOn(
      categoryRepo,
      "updateCategory",
    ).mockRejectedValue(new Error());
    const res = await app.request("/categories/1", {
      method: "PATCH",
      headers,
      body: JSON.stringify(validNewCategory),
    });

    expect(res.status).toBe(400);
    expect(mockedUpdateCategory).toBeCalledWith(
      "1",
      validNewCategory,
    );
  });
});

describe("DELETE /categories/:id", () => {
  it("should delete existing category", async () => {
    const mockedDeleteCategory = spyOn(
      categoryRepo,
      "deleteCategory",
    ).mockResolvedValue(mockedCategory);
    const res = await app.request("/categories/1", {
      method: "DELETE",
    });

    expect(res.status).toBe(204);
    expect(mockedDeleteCategory).toBeCalledWith("1");
  });

  it("should return error when deleted category does not exist", async () => {
    const mockedDeleteCategory = spyOn(
      categoryRepo,
      "deleteCategory",
    ).mockResolvedValue(null);
    const res = await app.request("/categories/999", {
      method: "DELETE",
    });

    expect(res.status).toBe(404);
    expect(mockedDeleteCategory).toBeCalledWith("999");
  });

  it.todo(
    "should return error when deleted category is already deleted",
    async () => {
      const res = await app.request("/categories/1", {
        method: "DELETE",
      });

      expect(res.status).toBe(410);
    },
  );
});
