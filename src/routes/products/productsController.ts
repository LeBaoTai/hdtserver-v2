import { eq } from 'drizzle-orm'
import { Request, Response } from 'express'
import { db } from '../../db'
import { productsTable } from '../../db/productsSchema'

export async function listProducts(req: Request, res: Response) {
  try {
    const products = await db.select().from(productsTable)
    res.status(200).send(products)
  } catch (e) {
    res.status(500).send({ message: e })
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, req.params.id))
    if (!product) {
      res.status(404).send({ message: 'Product not found!!!' })
    } else {
      res.status(200).send(product)
    }
  } catch (e) {
    res.status(500).send({ message: e })
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const [product] = await db
      .insert(productsTable)
      .values(req.body)
      .returning()
    res.status(201).send(product)
  } catch (e) {
    res.status(500).send({ message: e })
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const updateFields = req.body
    const [product] = await db
      .update(productsTable)
      .set(updateFields)
      .where(eq(productsTable.id, req.params.id))
      .returning()

    if (product) {
      res.status(201).send(product)
    } else {
      res.status(404).send({ message: 'Product was not found!!!' })
    }
  } catch (e) {
    res.status(500).send({ message: e })
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const [product] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, req.params.id))
      .returning()
    if (product) {
      res.status(204).send()
      return
    }
    res.status(404).send({ message: 'Product was not found!!!' })
  } catch (e) {
    res.status(500).send({ message: e })
  }
}
