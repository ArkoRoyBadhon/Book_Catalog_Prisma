import express from 'express'
import authPermission from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/users'
import { categoryController } from './category.controller'

const router = express.Router()

router.post(
  '/create-category',
  authPermission(ENUM_USER_ROLE.ADMIN),
  categoryController.insertIntoDB,
)
router.get('/', categoryController.getAllcategories)
router.get('/:id', categoryController.getSingleCategoryById)
router.patch(
  '/:id',
  authPermission(ENUM_USER_ROLE.ADMIN),
  categoryController.updateSingleCategoryById,
)
router.delete(
  '/:id',
  authPermission(ENUM_USER_ROLE.ADMIN),
  categoryController.deleteCategoryById,
)

export const categoryRoutes = router
