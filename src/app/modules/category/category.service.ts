/* eslint-disable @typescript-eslint/no-explicit-any */
import { Category } from '@prisma/client'
import prisma from '../../../shared/prisma'

const insertIntoDB = async (data: Category): Promise<Category> => {
  const result = await prisma.category.create({
    data,
    include: {
      books: true,
    },
  })

  return result
}

const getAllcategories = async (): Promise<Category[]> => {
  const result = await prisma.category.findMany({ include: { books: true } })

  return result
}

const getSingleCategoryById = async (id: string): Promise<Category | null> => {
  const result = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      books: true,
    },
  })

  return result
}

const updateSingleCategoryById = async (
  id: string,
  payload: Partial<Category>,
): Promise<Category | null> => {
  const result = await prisma.category.update({
    where: {
      id,
    },
    data: payload,
    include: {
      books: true,
    },
  })

  return result
}

const deleteCategoryById = async (id: string) => {
  const result = await prisma.category.delete({
    where: {
      id,
    },
  })

  return result
}

export const categoryService = {
  insertIntoDB,
  getAllcategories,
  getSingleCategoryById,
  updateSingleCategoryById,
  deleteCategoryById,
}
