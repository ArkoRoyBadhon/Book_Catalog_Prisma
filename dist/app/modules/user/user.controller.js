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
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {}
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p]
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]]
      }
    return t
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.userController = void 0
const catchAsync_1 = __importDefault(require('../../../shared/catchAsync'))
const user_service_1 = require('./user.service')
const sendResponse_1 = __importDefault(require('../../../shared/sendResponse'))
const http_status_1 = __importDefault(require('http-status'))
const config_1 = __importDefault(require('../../../config'))
const bcrypt_1 = __importDefault(require('bcrypt'))
const insertIntoDB = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body
    const hashPassword = yield bcrypt_1.default.hash(
      payload.password,
      Number(config_1.default.bycrypt_salt_rounds),
    )
    payload.password = hashPassword
    const result = yield user_service_1.userService.insertIntoDB(payload)
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'User created successfully!',
      data: result,
    })
  }),
)
const loginUser = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const loginData = __rest(req.body, [])
    const result = yield user_service_1.userService.loginUser(loginData)
    const { refreshToken, accessToken } = result
    const cookieOptions = {
      secure: config_1.default.env === 'production',
      httpOnly: true,
    }
    res.cookie('refreshToken', refreshToken, cookieOptions)
    ;(0, sendResponse_1.default)(res, {
      statusCode: 200,
      success: true,
      message: 'User logged In successfully !',
      data: { accessToken },
    })
  }),
)
const getAllUsers = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.getAllUsers()
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'User retrieved successfully!',
      data: result,
    })
  }),
)
const getSingleUserById = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id
    const result = yield user_service_1.userService.getSingleUserById(id)
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'User fetched successfully!',
      data: result,
    })
  }),
)
const updateUserById = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id
    const payload = req.body
    yield user_service_1.userService.updateUserById(id, payload)
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'User updated  successfully!',
      data: {},
    })
  }),
)
const deleteUserById = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id
    yield user_service_1.userService.deleteUserById(id)
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'User deleted   successfully!',
      data: {},
    })
  }),
)
const getProfile = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization || req.headers.Authorization
    const result = yield user_service_1.userService.getProfile(token)
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'profile retrieve successfully!',
      data: result,
    })
  }),
)
exports.userController = {
  insertIntoDB,
  loginUser,
  getAllUsers,
  getSingleUserById,
  updateUserById,
  deleteUserById,
  getProfile,
}
