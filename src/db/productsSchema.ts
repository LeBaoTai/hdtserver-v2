import { doublePrecision, integer, pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { categoriesTable } from './categoriesSchema.js'

export const productsTable = pgTable('products', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  primaryPrice: doublePrecision().notNull(),
  sellPrice: doublePrecision().notNull(),
  categoryId: uuid()
    .notNull()
    .references(() => categoriesTable.id)
})
