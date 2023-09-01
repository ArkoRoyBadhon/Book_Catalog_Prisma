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

export const bookService = {
  insertIntoDB,
  getAllBooks,
}
