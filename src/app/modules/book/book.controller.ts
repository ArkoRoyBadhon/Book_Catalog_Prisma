import httpStatus from 'http-status'
import sendResponse from '../../../shared/sendResponse'
import { bookService } from './book.service'
import catchAsync from '../../../shared/catchAsync'
import { Request, Response } from 'express'
import pick from '../../../shared/pick'
import { booksSearchableFields } from './book.constants'

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await bookService.insertIntoDB(req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book created successfully!',
    data: result,
  })
})

const getAllBooks = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, booksSearchableFields)
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
  const result = await bookService.getAllBooks(filters, options)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book created successfully!',
    meta: result.meta,
    data: result.data,
  })
})

export const bookController = {
  insertIntoDB,
  getAllBooks,
}
