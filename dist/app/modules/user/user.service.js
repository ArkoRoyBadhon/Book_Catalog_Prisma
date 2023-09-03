'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.userService = void 0
const prisma_1 = __importDefault(require('../../../shared/prisma'))
const config_1 = __importDefault(require('../../../config'))
const ApiError_1 = __importDefault(require('../../../errors/ApiError'))
const http_status_1 = __importDefault(require('http-status'))
const jwtHelpers_1 = require('../../../helpers/jwtHelpers')
const bcrypt_1 = __importDefault(require('bcrypt'))
const insertIntoDB = data =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.create({
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
  })
const loginUser = payload =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload
    const isUserExist = yield prisma_1.default.user.findUnique({
      where: {
        email,
      },
    })
    if (!isUserExist) {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        'User does not exist',
      )
    }
    // console.log('Password', password)
    // console.log('database Password', isUserExist?.password)
    // const dd = await bcrypt.compare(password, isUserExist?.password)
    // console.log('DD', dd)
    if (
      isUserExist.password &&
      !(yield bcrypt_1.default.compare(
        password,
        isUserExist === null || isUserExist === void 0
          ? void 0
          : isUserExist.password,
      ))
    ) {
      throw new ApiError_1.default(
        http_status_1.default.UNAUTHORIZED,
        'Password is incorrect',
      )
    }
    // create access token & refresh token
    const { id: userId, role } = isUserExist
    const accessToken = jwtHelpers_1.jwtHelpers.createToken(
      { userId, role },
      config_1.default.jwt.secret,
      config_1.default.jwt.expires_in,
    )
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken(
      { userId, role },
      config_1.default.jwt.refresh_secret,
      config_1.default.jwt.refresh_expires_in,
    )
    return {
      accessToken,
      refreshToken,
    }
  })
const getAllUsers = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findMany({
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
  })
const getSingleUserById = id =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
      where: {
        id,
      },
      include: {
        reviewAndRatings: true,
        order: true,
      },
    })
    return result
  })
const updateUserById = (id, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.update({
      where: {
        id,
      },
      data: payload,
      include: {
        reviewAndRatings: true,
      },
    })
    return result
  })
const deleteUserById = id =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.delete({
      where: {
        id,
      },
    })
    return result
  })
const getProfile = token =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
      throw new ApiError_1.default(
        http_status_1.default.UNAUTHORIZED,
        'You are not authorized',
      )
    }
    let verifiedUser = null
    if (typeof token === 'string') {
      verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(
        token,
        config_1.default.jwt.secret,
      )
    } else {
      console.error('Token is not a valid string')
    }
    const result = yield prisma_1.default.user.findUnique({
      where: {
        id:
          verifiedUser === null || verifiedUser === void 0
            ? void 0
            : verifiedUser.userId,
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
  })
exports.userService = {
  insertIntoDB,
  loginUser,
  getAllUsers,
  getSingleUserById,
  updateUserById,
  deleteUserById,
  getProfile,
}
