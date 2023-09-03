'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = __importDefault(require('express'))
const user_routes_1 = require('../modules/user/user.routes')
const category_routes_1 = require('../modules/category/category.routes')
const book_routes_1 = require('../modules/book/book.routes')
const order_routes_1 = require('../modules/order/order.routes')
const router = express_1.default.Router()
const moduleRoutes = [
  {
    path: '/',
    route: user_routes_1.userRoutes,
  },
  {
    path: '/categories',
    route: category_routes_1.categoryRoutes,
  },
  {
    path: '/books',
    route: book_routes_1.bookRoutes,
  },
  {
    path: '/orders',
    route: order_routes_1.orderRoutes,
  },
]
moduleRoutes.forEach(route => router.use(route.path, route.route))
exports.default = router
