import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import { categoryService } from './category.service'

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.insertIntoDB(req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category created successfully!',
    data: result,
  })
})
const getAllcategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getAllcategories()

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category fetched successfully!',
    data: result,
  })
})

export const categoryController = {
  insertIntoDB,
  getAllcategories,
}