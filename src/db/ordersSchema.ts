import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar
} from 'drizzle-orm/pg-core'
import { productsTable } from './productsSchema.js'

export const ordersTable = pgTable('orders', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 50 }).notNull(),
  phone: varchar({ length: 50 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  status: varchar({ length: 50 }).notNull().default('New')
})

export const orderItemsTable = pgTable('order_items', {
  id: uuid().primaryKey().defaultRandom(),
  orderId: uuid()
    .references(() => ordersTable.id)
    .notNull(),
  productId: uuid()
    .references(() => productsTable.id)
    .notNull(),
  quantity: integer().notNull().default(1)
})
