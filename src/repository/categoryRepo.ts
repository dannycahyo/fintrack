import prisma from "../db";
import type { Category } from "../types/Category";

export const getCategories = async (): Promise<Category[]> => {
  return prisma.category.findMany();
};

export const getCategoryById = async (
  id: string,
): Promise<Category | null> => {
  return prisma.category.findUnique({
    where: { id },
  });
};

export const createCategory = async (
  newCategory: Category,
): Promise<Category> => {
  return prisma.category.create({
    data: newCategory,
  });
};

export const updateCategory = async (
  id: string,
  updatedCategory: Partial<Category>,
): Promise<Category | null> => {
  return prisma.category.update({
    where: { id },
    data: updatedCategory,
  });
};

export const deleteCategory = async (
  id: string,
): Promise<Category | null> => {
  try {
    return await prisma.category.delete({
      where: { id },
    });
  } catch (error) {
    return null;
  }
};

export const bulkCreateCategories = async (
  categories: Category[],
): Promise<void> => {
  await prisma.category.createMany({
    data: categories,
  });
};
