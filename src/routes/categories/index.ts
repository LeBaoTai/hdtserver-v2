import { Router } from 'express'
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  listCategories,
  updateCategory
} from './categoriesController'

const router = Router()

router.get('/', listCategories)
router.post('/', createCategory)
router.get('/:id', getCategoryById)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

export default router
