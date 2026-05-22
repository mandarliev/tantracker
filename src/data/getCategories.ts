// src/app/actions/categories.server.ts
import { createServerFn } from '@tanstack/react-start'
import { db } from '#/db/index.ts'
import { categoriesTable } from '#/db/schema'

export const getCategories = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const categories = await db.select().from(categoriesTable)
      return categories
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      return []
    }
  },
)
