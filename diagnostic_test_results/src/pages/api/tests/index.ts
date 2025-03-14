import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

// Initialize Prisma Client
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
}).$extends({
  query: {
    async $allOperations({ operation, model, args, query }) {
      try {
        return await query(args);
      } catch (error) {
        console.error(`Error in ${operation} on ${model}:`, error);
        throw error;
      }
    },
  },
});

// Validation schema using Zod
const testResultSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  testType: z.string().min(1, "Test type is required"),
  result: z.string().min(1, "Test result is required"),
  notes: z.string().optional(),
  testDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

// The API handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // Validate request data
      const validatedData = testResultSchema.parse(req.body);

      // Create a new test in the database
      const test = await prisma.diagnosticTest.create({
        data: {
          patientName: validatedData.patientName,
          testType: validatedData.testType,
          result: validatedData.result,
          testDate: validatedData.testDate ? new Date(validatedData.testDate) : new Date(),
          notes: validatedData.notes,
        },
      });

      // Send the created test as the response
      res.status(201).json(test);
    } catch (error) {
      console.error("Error during test creation:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Internal server error" });
    }
  } else if (req.method === "GET") {
    try {
      // Fetch all tests from the database
      const tests = await prisma.diagnosticTest.findMany();
      res.status(200).json(tests);
    } catch (error) {
      console.error("Error fetching tests:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    // Handle unsupported HTTP methods
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
