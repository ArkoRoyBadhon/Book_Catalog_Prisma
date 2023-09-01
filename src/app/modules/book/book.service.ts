/* eslint-disable @typescript-eslint/no-explicit-any */
import { Book, Prisma } from '@prisma/client'
import prisma from '../../../shared/prisma'
import { IBookFilterRequest } from './book.interface'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { IGenericResponse } from '../../../interfaces/common'
import { paginationsHelpers } from '../../../helpers/paginationHelpers'
import { booksSearchableFields } from './book.constants'

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

// const getAllBooks = async (): Promise<Book[]> => {
//   const result = await prisma.book.findMany({
//     include: { category: true },
//   })

//   return result
// }

const getAllBooks = async (
  filters: IBookFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Book[]>> => {
  const { size, page, skip } = paginationsHelpers.calculatePagination(options)
  const { searchTerm, ...filterData } = filters

  const andConditions = []

  if (searchTerm) {
    andConditions.push({
      OR: booksSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insentitive',
        },
      })),
    })
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
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
