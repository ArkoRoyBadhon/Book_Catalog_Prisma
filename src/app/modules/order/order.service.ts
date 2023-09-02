/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order } from '@prisma/client'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'
import { jwtHelpers } from '../../../helpers/jwtHelpers'
import config from '../../../config'
import { Secret } from 'jsonwebtoken'
import prisma from '../../../shared/prisma'

const insertIntoDB = async (
  token: string | string[] | undefined,
  payload: any | undefined,
): Promise<Order> => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized')
  }

  let verifiedUser = null

  if (typeof token === 'string') {
    verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret)
  } else {
    console.error('Token is not a valid string')
  }

  const orderInfo = {
    userId: verifiedUser?.userId,
    orderedBooks: payload,
  }

  const result = await prisma.order.create({
    data: orderInfo,
  })

  return result
}

const getAllorders = async (token: string | string[] | undefined) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized')
  }

  let verifiedUser = null

  if (typeof token === 'string') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret)
  } else {
    console.error('Token is not a valid string')
  }

  if (verifiedUser?.role === 'customer') {
    const result = await prisma.order.findMany({
      where: {
        userId: verifiedUser?.userId,
      },
    })
    return result
  } else if (verifiedUser?.role === 'admin') {
    const result = await prisma.order.findMany({})
    return result
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'something went wrong')
  }
}

const getOrdersByid = async (
  token: string | string[] | undefined,
  id: string,
) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized')
  }

  let verifiedUser = null

  if (typeof token === 'string') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret)
  } else {
    console.error('Token is not a valid string')
  }

  if (verifiedUser?.role === 'admin') {
    const result = await prisma.order.findUnique({
      where: {
        id,
      },
    })
    return result
  } else if (verifiedUser?.role === 'customer') {
    const result = await prisma.order.findUnique({
      where: {
        id,
        userId: verifiedUser?.userId,
      },
    })
    return result
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'something went wrong')
  }
}

export const orderService = {
  insertIntoDB,
  getAllorders,
  getOrdersByid,
}
