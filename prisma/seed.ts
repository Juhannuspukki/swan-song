import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const load = async () => {
  try {
    await prisma.email.deleteMany();
    console.log("Deleted records in email table");

    await prisma.email.createMany({
      data: [],
      skipDuplicates: true,
    });
    console.log("Added email data");
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
