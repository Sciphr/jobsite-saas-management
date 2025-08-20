import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const managementPrisma = globalForPrisma.managementPrisma || 
  new PrismaClient({
    datasourceUrl: process.env.MANAGEMENT_DATABASE_URL || process.env.DATABASE_URL
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.managementPrisma = managementPrisma;
}