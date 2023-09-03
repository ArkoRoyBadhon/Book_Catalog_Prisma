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
exports.orderService = void 0
const ApiError_1 = __importDefault(require('../../../errors/ApiError'))
const http_status_1 = __importDefault(require('http-status'))
const jwtHelpers_1 = require('../../../helpers/jwtHelpers')
const config_1 = __importDefault(require('../../../config'))
const prisma_1 = __importDefault(require('../../../shared/prisma'))
const insertIntoDB = (token, payload) =>
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
    const orderInfo = {
      userId:
        verifiedUser === null || verifiedUser === void 0
          ? void 0
          : verifiedUser.userId,
      orderedBooks: payload,
    }
    const result = yield prisma_1.default.order.create({
      data: orderInfo,
    })
    return result
  })
const getAllorders = token =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
      throw new ApiError_1.default(
        http_status_1.default.UNAUTHORIZED,
        'You are not authorized',
      )
    }
    let verifiedUser = null
    if (typeof token === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(
        token,
        config_1.default.jwt.secret,
      )
    } else {
      console.error('Token is not a valid string')
    }
    if (
      (verifiedUser === null || verifiedUser === void 0
        ? void 0
        : verifiedUser.role) === 'customer'
    ) {
      const result = yield prisma_1.default.order.findMany({
        where: {
          userId:
            verifiedUser === null || verifiedUser === void 0
              ? void 0
              : verifiedUser.userId,
        },
      })
      return result
    } else if (
      (verifiedUser === null || verifiedUser === void 0
        ? void 0
        : verifiedUser.role) === 'admin'
    ) {
      const result = yield prisma_1.default.order.findMany({})
      return result
    } else {
      throw new ApiError_1.default(
        http_status_1.default.BAD_REQUEST,
        'something went wrong',
      )
    }
  })
const getOrdersByid = (token, id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
      throw new ApiError_1.default(
        http_status_1.default.UNAUTHORIZED,
        'You are not authorized',
      )
    }
    let verifiedUser = null
    if (typeof token === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(
        token,
        config_1.default.jwt.secret,
      )
    } else {
      console.error('Token is not a valid string')
    }
    if (
      (verifiedUser === null || verifiedUser === void 0
        ? void 0
        : verifiedUser.role) === 'admin'
    ) {
      const result = yield prisma_1.default.order.findUnique({
        where: {
          id,
        },
      })
      return result
    } else if (
      (verifiedUser === null || verifiedUser === void 0
        ? void 0
        : verifiedUser.role) === 'customer'
    ) {
      const result = yield prisma_1.default.order.findUnique({
        where: {
          id,
          userId:
            verifiedUser === null || verifiedUser === void 0
              ? void 0
              : verifiedUser.userId,
        },
      })
      return result
    } else {
      throw new ApiError_1.default(
        http_status_1.default.BAD_REQUEST,
        'something went wrong',
      )
    }
  })
exports.orderService = {
  insertIntoDB,
  getAllorders,
  getOrdersByid,
}
