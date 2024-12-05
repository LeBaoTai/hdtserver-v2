import { Request, Response } from 'express'
import { db } from '../../db'
import { orderItemsTable, ordersTable } from '../../db/ordersSchema'
import { and, eq } from 'drizzle-orm'
import { productsTable } from '../../db/productsSchema'

export async function createOrder(req: Request, res: Response) {
  try {
    const [newOrder] = await db.insert(ordersTable).values(req.body).returning()
    res.status(201).send(newOrder)
  } catch (e) {
    res.status(500).send({ message: e })
  }
}

export async function listOrders(req: Request, res: Response) {
  try {
    const orders = await db.select().from(ordersTable)
    res.status(200).send(orders)
  } catch (e) {
    res.status(500).send({ message: e })
  }
}

export async function updateOrder(req: Request, res: Response) {
  try {
    const orderId = req.params.id // UUID
    const { name, phone, status, items } = req.body

    // Validate if the order exists
    const order = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, orderId))
      .limit(1)
    if (!order.length) {
      res.status(404).send({ message: 'Order not found' })
      return
    }

    // Update order details
    if (name || phone || status) {
      await db
        .update(ordersTable)
        .set({ name, phone, status })
        .where(eq(ordersTable.id, orderId))
    }

    // Handle order items (if provided)
    if (Array.isArray(items) && items.length > 0) {
      const newItems = items.map((item: any) => ({
        orderId,
        productId: item.productId,
        quantity: item.quantity
      }))

      await db.insert(orderItemsTable).values(newItems)
    }

    res.status(200).send({ message: 'Order updated successfully' })
  } catch (error) {
    console.error('Error updating order:', error)
    res.status(500).send({ message: 'Failed to update order' })
  }
}

export async function updateProductQuantity(req: Request, res: Response) {
  try {
    const { id, productId } = req.params
    const { quantity } = req.body

    if (quantity <= 0) {
      res.status(400).send({ message: 'Quantity must be greater than zero' })
      return
    }

    // Update the quantity
    const [updatedItem] = await db
      .update(orderItemsTable)
      .set({ quantity })
      .where(
        and(
          eq(orderItemsTable.orderId, id),
          eq(orderItemsTable.productId, productId)
        )
      )
      .returning()

    if (!updatedItem) {
      res.status(404).send({ message: 'Product not found in the order' })
      return
    }

    res
      .status(200)
      .send({ message: 'Quantity updated successfully', item: updatedItem })
  } catch (error) {
    console.error('Error updating product quantity:', error)
    res.status(500).send({ message: 'Failed to update product quantity' })
  }
}

export async function deleteProductFromOrder(req: Request, res: Response) {
  try {
    const { id, productId } = req.params

    // Delete the product from the order
    await db
      .delete(orderItemsTable)
      .where(
        and(
          eq(orderItemsTable.orderId, id),
          eq(orderItemsTable.productId, productId)
        )
      )

    res
      .status(200)
      .send({ message: 'Product removed from the order successfully' })
  } catch (error) {
    console.error('Error deleting product from order:', error)
    res.status(500).send({ message: 'Failed to remove product from order' })
  }
}

export async function getOrderDetails(req: Request, res: Response) {
  try {
    const id = req.params.id // UUID of the order

    // Fetch the order
    const order = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, id))
      .limit(1)

    if (!order.length) {
      res.status(404).send({ message: 'Order not found' })
      return
    }

    // Fetch the products in the order
    const orderItems = await db
      .select({
        orderItemId: orderItemsTable.id,
        quantity: orderItemsTable.quantity,
        productId: productsTable.id,
        productName: productsTable.name,
        sellPrice: productsTable.sellPrice
      })
      .from(orderItemsTable)
      .innerJoin(productsTable, eq(orderItemsTable.productId, productsTable.id))
      .where(eq(orderItemsTable.orderId, id))

    // Combine order details with product details
    const orderDetails = {
      ...order[0],
      items: orderItems
    }

    res.status(200).send(orderDetails)
  } catch (error) {
    console.error('Error fetching order details:', error)
    res.status(500).send({ message: 'Failed to fetch order details' })
  }
}

export async function deleteOrder(req: Request, res: Response) {
  try {
    const id = req.params.id

    // Step 1: Check if the order exists
    const order = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, id))
    if (!order.length) {
      res.status(404).json({ message: 'Order not found' })
      return
    }

    // Step 2: Delete related order items
    await db.delete(orderItemsTable).where(eq(orderItemsTable.orderId, id))

    // Step 3: Delete the order
    await db.delete(ordersTable).where(eq(ordersTable.id, id))

    // Step 4: Send response
    res.status(200).json({ message: 'Order deleted successfully' })
  } catch (error) {
    console.error('Error deleting order:', error)
  }
}
