'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.categoryRoutes = void 0
const express_1 = __importDefault(require('express'))
const auth_1 = __importDefault(require('../../middlewares/auth'))
const users_1 = require('../../../enums/users')
const category_controller_1 = require('./category.controller')
const router = express_1.default.Router()
router.post(
  '/create-category',
  (0, auth_1.default)(users_1.ENUM_USER_ROLE.ADMIN),
  category_controller_1.categoryController.insertIntoDB,
)
router.get('/', category_controller_1.categoryController.getAllcategories)
router.get(
  '/:id',
  category_controller_1.categoryController.getSingleCategoryById,
)
router.patch(
  '/:id',
  (0, auth_1.default)(users_1.ENUM_USER_ROLE.ADMIN),
  category_controller_1.categoryController.updateSingleCategoryById,
)
router.delete(
  '/:id',
  (0, auth_1.default)(users_1.ENUM_USER_ROLE.ADMIN),
  category_controller_1.categoryController.deleteCategoryById,
)
exports.categoryRoutes = router
