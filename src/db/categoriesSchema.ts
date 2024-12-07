import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'

export const categoriesTable = pgTable('categories', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull()
})
