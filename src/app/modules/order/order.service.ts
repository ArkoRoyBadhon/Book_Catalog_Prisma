/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order } from '@prisma/client'
// import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'
import { jwtHelpers } from '../../../helpers/jwtHelpers'
import config from '../../../config'
import { Secret } from 'jsonwebtoken'

const insertIntoDB = async (token: string, payload: Order): Promise<any> => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized')
  }

  let verifiedUser = null

  verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret)

  const { userId } = verifiedUser
  console.log('verified User', userId)

  const orderInfo = {
    userId: userId,
    orderedBooks: payload,
  }

  console.log('info', orderInfo)

  //   const result = await prisma.order.create({
  //     data: payload,
  //   })

  return 'result'
}

export const orderService = {
  insertIntoDB,
}
