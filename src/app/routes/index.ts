import express from 'express'
import { userRoutes } from '../modules/user/user.routes'
import { categoryRoutes } from '../modules/category/category.routes'
import { bookRoutes } from '../modules/book/book.routes'

const router = express.Router()

const moduleRoutes = [
  {
    path: '/',
    route: userRoutes,
  },
  {
    path: '/categories',
    route: categoryRoutes,
  },
  {
    path: '/books',
    route: bookRoutes,
  },
]

moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
