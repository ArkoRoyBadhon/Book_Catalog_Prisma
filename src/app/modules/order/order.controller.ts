import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
// import { orderService } from './order.service'
import httpStatus from 'http-status'
import sendResponse from '../../../shared/sendResponse'

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || req.headers.Authorization

  console.log('token order', token)

  // const result = await orderService.insertIntoDB(token, req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order created successfully!',
    data: 'result',
  })
})

export const orderController = {
  insertIntoDB,
}
