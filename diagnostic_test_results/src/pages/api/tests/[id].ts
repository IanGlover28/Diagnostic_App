import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schema for validating test creation
const TestCreateSchema = z.object({
  patientName: z.string().min(1, { message: "Patient name is required" }),
  testType: z.string().min(1, { message: "Test type is required" }),
  result: z.string().min(1, { message: "Result is required" }),
  testDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  notes: z.string().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  
  if (method === 'POST') {
    try {
      // Validate request body
      const validatedData = TestCreateSchema.parse(req.body);
      
      // Convert string date to Date object
      const testDate = new Date(validatedData.testDate);
      
      // Create new test result in the database
      const testResult = await prisma.diagnosticTest.create({
        data: {
          patientName: validatedData.patientName,
          testType: validatedData.testType,
          result: validatedData.result,
          testDate,
          notes: validatedData.notes || '',
        },
      });
      
      return res.status(201).json(testResult);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }

      // Log any unexpected error
      console.error('Unexpected error:', error);
      
      return res.status(500).json({ error: 'Failed to create test result' });
    }
  } else if (method === 'GET') {
    try {
      // Get all test results
      const testResults = await prisma.diagnosticTest.findMany({
        orderBy: {
          testDate: 'desc',
        },
      });
      
      return res.status(200).json(testResults);
    } catch (error) {
      // Log error for debugging
      console.error('Failed to fetch test results:', error);
      return res.status(500).json({ error: 'Failed to fetch test results' });
    }
  } else if (method === 'DELETE') {
    try {
      // Get test ID from URL query parameters
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Test ID is required' });
      }

      // Delete the test result from the database
      const deletedTest = await prisma.diagnosticTest.delete({
        where: { id },
      });

      return res.status(200).json(deletedTest);
    } catch (error) {
      // Log error for debugging
      console.error('Failed to delete test result:', error);
      return res.status(500).json({ error: 'Failed to delete test result' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
