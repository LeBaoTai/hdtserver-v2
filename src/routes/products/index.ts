import { Router } from 'express'
import {
  listProducts,
  getProductById,
  updateProduct,
  createProduct,
  deleteProduct
} from './productsController.js'

const router = Router()

router.get('/', listProducts)
router.get('/:id', getProductById)
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router
