import { asc, eq } from 'drizzle-orm'
import { Request, Response } from 'express'
import { categoriesTable } from '../../db/categoriesSchema.js'
import { db } from '../../db/index.js'
import { productsTable } from '../../db/productsSchema.js'

export async function listCategories(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string)
    const perPage = 50
    const offset = (page - 1) * perPage
    const categories = await db
      .select()
      .from(categoriesTable)
      .limit(perPage)
      .offset(offset)
      .orderBy(asc(categoriesTable.name))
    res.status(200).send(categories)
  } catch (e) {
    res.status(500).send({ message: e })
  }
}

export async function getCategoryByIdNolimit(req: Request, res: Response) {
  try {
    const id = req.params.id // UUID of the category

    // Fetch the category
    const category = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, id))
      .limit(1)

    if (!category.length) {
      res.status(404).send({ message: 'Category not found' })
      return
    }

    // Fetch the products in the category
    const products = await db
      .select({
        productId: productsTable.id,
        productName: productsTable.name,
        primaryPrice: productsTable.primaryPrice,
        sellPrice: productsTable.sellPrice
      })
      .from(productsTable)
      .where(eq(productsTable.categoryId, id))
      .orderBy(asc(productsTable.name))

    // Combine category details with product list
    const categoryDetails = {
      ...category[0],
      products
    }

    res.status(200).send(categoryDetails)
  } catch (e) {
    res.status(500).send({ message: e })
  }
}

export async function getCategoryById(req: Request, res: Response) {
  try {
    const id = req.params.id // UUID of the category

    // Fetch the category
    const category = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, id))
      .limit(1)

    if (!category.length) {
      res.status(404).send({ message: 'Category not found' })
      return
    }

    const page = parseInt(req.query.page as string)
    const perPage = 50
    const offset = (page - 1) * perPage
    // Fetch the products in the category
    const products = await db
      .select({
        productId: productsTable.id,
        productName: productsTable.name,
        primaryPrice: productsTable.primaryPrice,
        sellPrice: productsTable.sellPrice
      })
      .from(productsTable)
      .where(eq(productsTable.categoryId, id))
      .limit(perPage)
      .offset(offset)
      .orderBy(asc(productsTable.name))

    // Combine category details with product list
    const categoryDetails = {
      ...category[0],
      products
    }

    res.status(200).send(categoryDetails)
  } catch (e) {
    res.status(500).send({ message: e })
  }
}

export async function createCategory(req: Request, res: Response) {
  try {
    const [category] = await db
      .insert(categoriesTable)
      .values(req.body)
      .returning()
    res.status(201).send(category)
  } catch (e) {
    res.status(500).send({ message: e })
  }
}

export async function updateCategory(req: Request, res: Response) {
  try {
    const id = req.params.id
    const updateFields = req.body
    const [category] = await db
      .update(categoriesTable)
      .set(updateFields)
      .where(eq(categoriesTable.id, id))
      .returning()

    if (category) {
      res.status(201).send(category)
      return
    }

    res.status(404).send({ message: 'Category was not found!!!' })
  } catch (e) {
    res.status(501).send({ message: e })
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const id = req.params.id

    // Step 1: Check if the category exists
    const category = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, id))
    if (!category.length) {
      res.status(404).json({ message: 'Category not found' })
      return
    }

    // Step 2: Delete related products
    await db.delete(productsTable).where(eq(productsTable.categoryId, id))

    // Step 3: Delete the category
    await db.delete(categoriesTable).where(eq(categoriesTable.id, id))

    // Step 4: Send response
    res
      .status(200)
      .json({ message: 'Category and its products deleted successfully' })
  } catch (e) {
    res.status(501).send({ message: e })
  }
}
