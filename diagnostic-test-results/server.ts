import express, { Request, Response ,Application } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Create Express app
const app: Application  = express();
app.use(express.json());

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

// Create a Diagnostic Test Result
app.post("/api/tests", async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = testResultSchema.parse(req.body);

    // Create a new test result
    const test = await prisma.diagnosticTest.create({
      data: {
        patientName: validatedData.patientName,
        testType: validatedData.testType,
        result: validatedData.result,
        testDate: validatedData.testDate ? new Date(validatedData.testDate) : new Date(),
        notes: validatedData.notes,
      },
    });
    return res.status(201).json(test);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error instanceof Error ? error.message : "Validation failed" });
  }
});

// Get a Test Result by ID
app.get("/api/tests/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const test = await prisma.diagnosticTest.findUnique({
      where: { id },
    });
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    return res.json(test);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Update a Test Result
app.put("/api/tests/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Validate input data
    const validatedData = testResultSchema.parse(req.body);

    // Update test result
    const updatedTest = await prisma.diagnosticTest.update({
      where: { id },
      data: {
        patientName: validatedData.patientName,
        testType: validatedData.testType,
        result: validatedData.result,
        notes: validatedData.notes,
        testDate: validatedData.testDate ? new Date(validatedData.testDate) : undefined,
      },
    });
    return res.json(updatedTest);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error instanceof Error ? error.message : "Validation failed" });
  }
});

// Delete a Test Result
app.delete("/api/tests/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedTest = await prisma.diagnosticTest.delete({
      where: { id },
    });
    return res.json(deletedTest);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: "Test not found" });
  }
});

// List All Test Results
app.get("/api/tests", async (req: Request, res: Response) => {
  try {
    const tests = await prisma.diagnosticTest.findMany();
    return res.json(tests);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
