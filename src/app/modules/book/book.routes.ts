import express from 'express'
import authPermission from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/users'
import { bookController } from './book.controller'

const router = express.Router()

router.post(
  '/create-book',
  authPermission(ENUM_USER_ROLE.ADMIN),
  bookController.insertIntoDB,
)
router.get('/', bookController.getAllBooks)

export const bookRoutes = router
