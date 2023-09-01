import { Book } from '@prisma/client'
import prisma from '../../../shared/prisma'

const insertIntoDB = async (payload: Book): Promise<Book> => {
  console.log(payload)
  const result = await prisma.book.create({
    data: payload,
  })

  return result
}

export const bookService = {
  insertIntoDB,
}
