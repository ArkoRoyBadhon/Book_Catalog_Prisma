/* eslint-disable @typescript-eslint/no-explicit-any */
import { Book, Prisma } from '@prisma/client'
import prisma from '../../../shared/prisma'
import { IBookFilterRequest } from './book.interface'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { IGenericResponse } from '../../../interfaces/common'
import { paginationsHelpers } from '../../../helpers/paginationHelpers'
import {
  booksRelationalFieldsMapper,
  booksSearchableFields,
} from './book.constants'

const insertIntoDB = async (payload: Book): Promise<Book> => {
  const data = new Date(payload?.publicationDate)
  payload.publicationDate = data
  console.log('insert Data', payload)

  const result = await prisma.book.create({
    data: payload,
    include: { category: true },
  })

  return result
}

const getAllBooks = async (
  filters: IBookFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Book[]>> => {
  const { size, page, skip } = paginationsHelpers.calculatePagination(options)
  const { search, category, minPrice, maxPrice, ...filterData } = filters

  const andConditions = []

  if (search) {
    andConditions.push({
      OR: booksSearchableFields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      })),
    })
  }

  if (category) {
    andConditions.push({
      OR: booksSearchableFields.map(field => ({
        [field]: {
          contains: category,
          mode: 'insensitive',
        },
      })),
    })
  }

  if (minPrice !== undefined) {
    andConditions.push({
      price: {
        gte: parseFloat(minPrice),
      },
    })
  }
  if (maxPrice !== undefined) {
    andConditions.push({
      price: {
        lte: parseFloat(maxPrice),
      },
    })
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (booksSearchableFields.includes(key)) {
          return {
            [booksRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          }
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          }
        }
      }),
    })
  }

  const whereConditions: Prisma.BookWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.book.findMany({
    include: {
      category: true,
    },
    where: whereConditions,
    skip,
    take: size,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            publicationDate: 'desc',
          },
  })

  const total = await prisma.book.count({
    where: whereConditions,
  })

  const totalPage = Math.ceil(total / size)

  return {
    meta: {
      total,
      page,
      size,
      totalPage,
    },
    data: result,
  }
}

const getBookBuCategoryId = async (
  id: string,
  options: IPaginationOptions,
): Promise<IGenericResponse<Book[] | null>> => {
  const { size, page } = paginationsHelpers.calculatePagination(options)

  const result = await prisma.category.findMany({
    where: {
      id: id,
    },
    select: {
      books: true,
    },
  })

  const total = result[0].books.length

  const totalPage = Math.ceil(total / size)

  const finalResult = {
    meta: {
      total,
      page,
      size,
      totalPage,
    },
    data: Array.isArray(result) ? result[0].books : result,
  }

  return finalResult
}

const getSingleBookById = async (id: string): Promise<Book | null> => {
  const result = await prisma.book.findUnique({
    where: {
      id,
    },
  })

  return result
}

const updateSingleBookById = async (
  id: string,
  payload: Partial<Book>,
): Promise<Book | null> => {
  const result = await prisma.book.update({
    where: {
      id,
    },
    data: payload,
  })

  return result
}

const deleteSingleBookById = async (id: string): Promise<Book | null> => {
  const result = await prisma.book.delete({
    where: {
      id,
    },
  })

  return result
}

export const bookService = {
  insertIntoDB,
  getAllBooks,
  getBookBuCategoryId,
  getSingleBookById,
  updateSingleBookById,
  deleteSingleBookById,
}
