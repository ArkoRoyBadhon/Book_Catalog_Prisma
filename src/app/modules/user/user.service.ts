/* eslint-disable @typescript-eslint/no-explicit-any */
import { User, Prisma } from '@prisma/client'
import prisma from '../../../shared/prisma'
import { IUserFilterRequest } from './user.interface'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { IGenericResponse } from '../../../interfaces/common'
import { paginationsHelpers } from '../../../helpers/paginationHelpers'
import { userSearchableFields } from './user.constants'
import { ILoginAllUser, ILoginAllUserResponse } from '../../../interfaces/auth'
import config from '../../../config'
import { Secret } from 'jsonwebtoken'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'
import { jwtHelpers } from '../../../helpers/jwtHelpers'
import bcrypt from 'bcrypt'

const insertIntoDB = async (data: User): Promise<User> => {
  const result = await prisma.user.create({
    data,
    include: {
      reviewAndRatings: true,
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
  const dd = await bcrypt.compare(password, isUserExist?.password)
  console.log('DD', dd)

  if (
    isUserExist.password &&
    !(await bcrypt.compare(password, isUserExist?.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect')
  }

  // create access token & refresh token
  const { id: Id, role } = isUserExist

  const accessToken = jwtHelpers.createToken(
    { Id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  )

  const refreshToken = jwtHelpers.createToken(
    { Id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  )

  return {
    accessToken,
    refreshToken,
  }
}

const getAllUsers = async (
  filters: IUserFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<User[]>> => {
  const { limit, page, skip } = paginationsHelpers.calculatePagination(options)
  const { searchTerm, ...filterData } = filters

  const andConditions = []

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insentitive',
        },
      })),
    })
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        }
      }),
    })
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.user.findMany({
    include: {
      reviewAndRatings: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            name: 'asc',
          },
  })

  const total = await prisma.user.count({
    where: whereConditions,
  })

  console.log(typeof total)

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  }
}

const getSingleUserById = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      reviewAndRatings: true,
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

export const userService = {
  insertIntoDB,
  loginUser,
  getAllUsers,
  getSingleUserById,
  updateUserById,
  deleteUserById,
}
