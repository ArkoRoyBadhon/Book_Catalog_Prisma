import express from 'express'
import { userRoutes } from '../modules/user/user.routes'
import { categoryRoutes } from '../modules/category/category.routes'

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
]

moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
