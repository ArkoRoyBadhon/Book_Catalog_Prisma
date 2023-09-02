import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import { orderService } from './order.service'
import httpStatus from 'http-status'
import sendResponse from '../../../shared/sendResponse'

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || req.headers.Authorization

  //   console.log('body', req.body.orderedBooks)

  const result = await orderService.insertIntoDB(token, req.body.orderedBooks)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order created successfully!',
    data: result,
  })
})

const getAllorders = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || req.headers.Authorization
  const result = await orderService.getAllorders(token)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order fetched successfully!',
    data: result,
  })
})

export const orderController = {
  insertIntoDB,
  getAllorders,
}
