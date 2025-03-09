import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    // This will test the database connection
    await prisma.$connect()
    console.log('✅ Database connection successful!')
    
    // Optional: Test a simple query
    const testQuery = await prisma.diagnosticTest.findMany({
      take: 1
    })
    console.log('Test query executed successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()