import httpStatus from 'http-status'
import sendResponse from '../../../shared/sendResponse'
import { bookService } from './book.service'
import catchAsync from '../../../shared/catchAsync'
import { Request, Response } from 'express'
import pick from '../../../shared/pick'
import { booksFilterableFields } from './book.constants'

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
  const filters = pick(req.query, booksFilterableFields)
  const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
  // console.log('Option', filters)

  const result = await bookService.getAllBooks(filters, options)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books fetched successfully!',
    meta: result.meta,
    data: result.data,
  })
})

const getBookBuCategoryId = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
  const result = await bookService.getBookBuCategoryId(
    req.params.categoryId,
    options,
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books with associated category data fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})

const getSingleBookById = catchAsync(async (req: Request, res: Response) => {
  const result = await bookService.getSingleBookById(req.params.id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book fetced successfully!',
    data: result,
  })
})

const updateSingleBookById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const payload = req.body
  const result = await bookService.updateSingleBookById(id, payload)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book updated successfully!',
    data: result,
  })
})

const deleteSingleBookById = catchAsync(async (req: Request, res: Response) => {
  const result = await bookService.deleteSingleBookById(req.params.id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book deleted successfully!',
    data: result,
  })
})

export const bookController = {
  insertIntoDB,
  getAllBooks,
  getBookBuCategoryId,
  getSingleBookById,
  updateSingleBookById,
  deleteSingleBookById,
}
