import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import { userService } from './user.service'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'
import { userSearchableFields } from './user.constants'
import config from '../../../config'
import { ILoginAllUserResponse } from '../../../interfaces/auth'
import bcrypt from 'bcrypt'

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body
  const hashPassword = await bcrypt.hash(
    payload.password,
    Number(config.bycrypt_salt_rounds),
  )
  payload.password = hashPassword
  const result = await userService.insertIntoDB(payload)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully!',
    data: result,
  })
})

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body
  const result = await userService.loginUser(loginData)
  const { refreshToken, accessToken } = result

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }

  res.cookie('refreshToken', refreshToken, cookieOptions)

  sendResponse<ILoginAllUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged In successfully !',
    data: { accessToken },
  })
})

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userSearchableFields)
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
  const result = await userService.getAllUsers(filters, options)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully!',
    data: result,
  })
})

const getSingleUserById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await userService.getSingleUserById(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User fetched successfully!',
    data: result,
  })
})

const updateUserById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const payload = req.body
  await userService.updateUserById(id, payload)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated  successfully!',
    data: {},
  })
})
const deleteUserById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  await userService.deleteUserById(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted   successfully!',
    data: {},
  })
})

export const userController = {
  insertIntoDB,
  loginUser,
  getAllUsers,
  getSingleUserById,
  updateUserById,
  deleteUserById,
}
