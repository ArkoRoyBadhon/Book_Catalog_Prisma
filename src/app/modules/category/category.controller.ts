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
const getSingleCategoryById = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const result = await categoryService.getSingleCategoryById(id)

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Category fetched successfully!',
      data: result,
    })
  },
)
const updateSingleCategoryById = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const payload = req.body
    const result = await categoryService.updateSingleCategoryById(id, payload)

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Category updated successfully!',
      data: result,
    })
  },
)

const deleteCategoryById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await categoryService.deleteCategoryById(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category deleted successfully!',
    data: result,
  })
})

export const categoryController = {
  insertIntoDB,
  getAllcategories,
  getSingleCategoryById,
  updateSingleCategoryById,
  deleteCategoryById,
}
