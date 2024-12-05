import { Router } from 'express'
import {
  createOrder,
  deleteOrder,
  deleteProductFromOrder,
  getOrderDetails,
  // getOrder,
  listOrders,
  updateOrder,
  updateProductQuantity
} from './ordersController'

const router = Router()

router.post('/', createOrder)
router.get('/', listOrders)
router.get('/:id', getOrderDetails)
router.put('/:id', updateOrder)
router.put('/:id/products/:productId', updateProductQuantity)
router.delete('/:id/products/:productId', deleteProductFromOrder)
router.delete('/:id', deleteOrder)

export default router
