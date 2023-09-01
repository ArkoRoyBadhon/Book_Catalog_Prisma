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

export const categoryService = {
  insertIntoDB,
  getAllcategories,
}
