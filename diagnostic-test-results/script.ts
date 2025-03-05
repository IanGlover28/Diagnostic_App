const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


async function main() {
    const diagnosticTest = await prisma.diagnosticTest.create({
        data: {
            patientName: "Zain",
            testType: "Blood Test",  // Required field
            result: "Pending",       // Required field
            testDate: new Date(),    // Required field
            notes: "Patient has mild symptoms." // Optional field
        }
    });

    console.log(diagnosticTest);
}

main()
  .catch(e => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
