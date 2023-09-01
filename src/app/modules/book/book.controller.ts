import httpStatus from 'http-status'
import sendResponse from '../../../shared/sendResponse'
import { bookService } from './book.service'
import catchAsync from '../../../shared/catchAsync'
import { Request, Response } from 'express'

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await bookService.insertIntoDB(req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book created successfully!',
    data: result,
  })
})

export const bookController = {
  insertIntoDB,
}
