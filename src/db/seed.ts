import 'dotenv/config' // <-- MUST BE THE FIRST LINE. Do not put anything above this.
import { db } from '.'
import { categoriesTable } from './schema'

const categoriesSeedData: (typeof categoriesTable.$inferInsert)[] = [
  { name: 'Salary', type: 'income' },
  { name: 'Rental Income', type: 'income' },
  { name: 'Business Income', type: 'income' },
  { name: 'Investments', type: 'income' },
  { name: 'Other', type: 'income' },
  { name: 'Housing', type: 'expense' },
  { name: 'Transport', type: 'expense' },
  { name: 'Food & Groceries', type: 'expense' },
  { name: 'Health', type: 'expense' },
  { name: 'Entertainment & Leisure', type: 'expense' },
  { name: 'Other', type: 'expense' },
]

async function main() {
  try {
    console.log('⏳ Seeding database records...')
    await db.insert(categoriesTable).values(categoriesSeedData)
    console.log('✅ Seeding complete!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error executing seed script:', error)
    process.exit(1)
  }
}

main()
