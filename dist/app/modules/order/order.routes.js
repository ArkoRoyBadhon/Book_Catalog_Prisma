'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.orderRoutes = void 0
const express_1 = __importDefault(require('express'))
const auth_1 = __importDefault(require('../../middlewares/auth'))
const users_1 = require('../../../enums/users')
const order_controller_1 = require('./order.controller')
const router = express_1.default.Router()
router.post(
  '/create-order',
  //   authPermission(ENUM_USER_ROLE.ADMIN),
  order_controller_1.orderController.insertIntoDB,
)
router.get(
  '/',
  (0, auth_1.default)(
    users_1.ENUM_USER_ROLE.ADMIN,
    users_1.ENUM_USER_ROLE.CUSTOMER,
  ),
  order_controller_1.orderController.getAllorders,
)
router.get(
  '/:orderId',
  (0, auth_1.default)(
    users_1.ENUM_USER_ROLE.ADMIN,
    users_1.ENUM_USER_ROLE.CUSTOMER,
  ),
  order_controller_1.orderController.getOrdersByid,
)
exports.orderRoutes = router
