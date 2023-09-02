import express from 'express'
import authPermission from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/users'
import { orderController } from './order.controller'

const router = express.Router()

router.post(
  '/create-order',
  authPermission(ENUM_USER_ROLE.ADMIN),
  orderController.insertIntoDB,
)

export const orderRoutes = router
