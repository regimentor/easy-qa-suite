import { Prisma } from ".prisma/client";
import { prismaClient } from "../prisma.client";

function findBy(where: Prisma.TestCaseWhereInput) {
  return prismaClient.testCase.findMany({ 
    where,
    include: {
      status: true,
      priority: true
    }
  });
}

function firstFindBy(where: Prisma.TestCaseWhereInput) {
  return prismaClient.testCase.findFirst({ 
    where,
    include: {
      status: true,
      priority: true
    }
  });
}

function create(data: Prisma.TestCaseCreateInput) {
  return prismaClient.testCase.create({ data });
}

export const testCasesRepository = {
  findBy,
  firstFindBy,
  create
};
