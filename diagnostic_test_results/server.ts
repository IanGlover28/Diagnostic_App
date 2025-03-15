import express, { Request, Response, NextFunction, Application } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import asyncHandler from "express-async-handler";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Create Express app
const app: Application = express();
app.use(express.json());

// Validation schema using Zod
const testResultSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  testType: z.string().min(1, "Test type is required"),
  result: z.string().min(1, "Test result is required"),
  notes: z.string().optional(),
  testDate: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

// Create a Diagnostic Test Result
app.post(
    "/api/tests",
    asyncHandler(async (req: Request, res: Response) => {
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
        console.error("Error during test creation:", error); // Log the error to understand the issue
        res.status(500).json({
          message: error instanceof Error ? error.message : "Internal server error",
        });
      }
    })
  );
  

// Get a Test Result by ID
app.get(
  "/api/tests/:id",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const test = await prisma.diagnosticTest.findUnique({
      where: { id },
    });

    if (!test) {
      res.status(404).json({ message: "Test not found" });
      return;
    }

    res.json(test);
  })
);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
  next();
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
