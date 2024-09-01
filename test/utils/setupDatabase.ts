import {
  PrismaClient,
  RoutineMode,
  TaskPriority,
  TaskStatus,
} from '@prisma/client';

export const setupDatabase = async () => {
  const prisma = new PrismaClient();
  await prisma.$connect();
  await cleanDatabase(prisma);
  await createData(prisma);
  await prisma.$disconnect();
};

const cleanDatabase = async (prisma: PrismaClient) => {
  await prisma.$executeRaw`TRUNCATE TABLE "Comment" RESTART IDENTITY CASCADE;`; // Clean up
  await prisma.$executeRaw`TRUNCATE TABLE "Note" RESTART IDENTITY CASCADE;`; // Clean up
  await prisma.$executeRaw`TRUNCATE TABLE "Routine" RESTART IDENTITY CASCADE;`; // Clean up
  await prisma.$executeRaw`TRUNCATE TABLE "TaskDependency" RESTART IDENTITY CASCADE;`; // Clean up
  await prisma.$executeRaw`TRUNCATE TABLE "Task" RESTART IDENTITY CASCADE;`; // Clean up
  await prisma.$executeRaw`TRUNCATE TABLE "Project" RESTART IDENTITY CASCADE;`; // Clean up
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`; // Clean up
  await prisma.$executeRaw`TRUNCATE TABLE "Customer" RESTART IDENTITY CASCADE;`; // Clean up
  return true;
};

const createData = async (prisma: PrismaClient) => {
  await prisma.$transaction([
    prisma.customer.create({
      data: {
        name: 'customer-1',
      },
    }),
    prisma.user.createMany({
      data: [
        {
          name: 'user-1',
          username: 'user-1',
          password: 'password-1',
          phone: 'phone-1',
        },
        {
          name: 'user-2',
          username: 'user-2',
          password: 'password-2',
          phone: 'phone-2',
        },
      ],
    }),
    prisma.project.create({
      data: {
        title: 'projet-1',
        description: 'description',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.PENDING,
        userId: 1,
        customerId: 1,
      },
    }),
    prisma.routine.createMany({
      data: {
        title: 'projet-1',
        description: 'description',
        creatorId: 1,
        assignedId: 1,
        customerId: 1,
        mode: RoutineMode.WEEKLY,
        weekDays: [1],
        targetDate: new Date(),
      },
    }),
  ]);
};
