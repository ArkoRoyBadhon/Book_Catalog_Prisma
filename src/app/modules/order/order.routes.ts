import express from 'express'
import authPermission from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/users'
import { orderController } from './order.controller'

const router = express.Router()

router.post(
  '/create-order',
  authPermission(ENUM_USER_ROLE.CUSTOMER),
  orderController.insertIntoDB,
)

router.get(
  '/',
  authPermission(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
  orderController.getAllorders,
)

router.get(
  '/:orderId',
  authPermission(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
  orderController.getOrdersByid,
)

export const orderRoutes = router
