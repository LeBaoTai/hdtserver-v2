import { Router } from 'express'
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategoryByIdNolimit,
  listCategories,
  updateCategory
} from './categoriesController.js'

const router = Router()

router.get('/', listCategories)
router.post('/', createCategory)
router.get('/:id', getCategoryById)
router.get('/:id/nolimit', getCategoryByIdNolimit)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

export default router
