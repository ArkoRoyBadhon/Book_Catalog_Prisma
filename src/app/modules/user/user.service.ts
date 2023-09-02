/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@prisma/client'
import prisma from '../../../shared/prisma'
// import { IUserFilterRequest } from './user.interface'
// import { IPaginationOptions } from '../../../interfaces/pagination'
// import { IGenericResponse } from '../../../interfaces/common'
// import { paginationsHelpers } from '../../../helpers/paginationHelpers'
// import { userSearchableFields } from './user.constants'
import { ILoginAllUser, ILoginAllUserResponse } from '../../../interfaces/auth'
import config from '../../../config'
import { Secret } from 'jsonwebtoken'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'
import { jwtHelpers } from '../../../helpers/jwtHelpers'
import bcrypt from 'bcrypt'

const insertIntoDB = async (data: User): Promise<Partial<User>> => {
  const result = await prisma.user.create({
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      contactNo: true,
      address: true,
      profileImg: true,
    },
  })

  return result
}

const loginUser = async (
  payload: ILoginAllUser,
): Promise<ILoginAllUserResponse> => {
  const { email, password } = payload

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }
  console.log('Password', password)
  console.log('database Password', isUserExist?.password)
  // const dd = await bcrypt.compare(password, isUserExist?.password)
  // console.log('DD', dd)

  if (
    isUserExist.password &&
    !(await bcrypt.compare(password, isUserExist?.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect')
  }

  // create access token & refresh token
  const { id: userId, role } = isUserExist

  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  )

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  )

  return {
    accessToken,
    refreshToken,
  }
}

const getAllUsers = async (): Promise<Partial<User>[]> => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      contactNo: true,
      address: true,
      profileImg: true,
    },
  })

  return result
}

const getSingleUserById = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      reviewAndRatings: true,
      order: true,
    },
  })

  return result
}

const updateUserById = async (
  id: string,
  payload: Partial<User>,
): Promise<User> => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
    include: {
      reviewAndRatings: true,
    },
  })

  return result
}

const deleteUserById = async (id: string) => {
  const result = await prisma.user.delete({
    where: {
      id,
    },
  })

  return result
}

const getProfile = async (token: string | string[] | undefined) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized')
  }

  let verifiedUser = null

  if (typeof token === 'string') {
    verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret)
  } else {
    console.error('Token is not a valid string')
  }

  const result = await prisma.user.findUnique({
    where: {
      id: verifiedUser?.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      contactNo: true,
      address: true,
      profileImg: true,
    },
  })

  return result
}

export const userService = {
  insertIntoDB,
  loginUser,
  getAllUsers,
  getSingleUserById,
  updateUserById,
  deleteUserById,
  getProfile,
}
