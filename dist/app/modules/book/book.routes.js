'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.bookRoutes = void 0
const express_1 = __importDefault(require('express'))
const auth_1 = __importDefault(require('../../middlewares/auth'))
const users_1 = require('../../../enums/users')
const book_controller_1 = require('./book.controller')
const router = express_1.default.Router()
router.post(
  '/create-book',
  (0, auth_1.default)(users_1.ENUM_USER_ROLE.ADMIN),
  book_controller_1.bookController.insertIntoDB,
)
router.get('/', book_controller_1.bookController.getAllBooks)
router.get(
  '/:categoryId/category',
  book_controller_1.bookController.getBookBuCategoryId,
)
router.get('/:id', book_controller_1.bookController.getSingleBookById)
router.patch(
  '/:id',
  (0, auth_1.default)(users_1.ENUM_USER_ROLE.ADMIN),
  book_controller_1.bookController.updateSingleBookById,
)
router.delete(
  '/:id',
  (0, auth_1.default)(users_1.ENUM_USER_ROLE.ADMIN),
  book_controller_1.bookController.deleteSingleBookById,
)
exports.bookRoutes = router
