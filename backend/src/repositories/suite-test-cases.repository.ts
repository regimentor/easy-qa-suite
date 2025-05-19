import { Prisma } from ".prisma/client";
import { prismaClient } from "../prisma.client";

function findBy(where: Prisma.SuiteTestCaseWhereInput) {
  return prismaClient.suiteTestCase.findMany({ where });
}

function create(data: Prisma.SuiteTestCaseCreateInput) {
  return prismaClient.suiteTestCase.create({ data });
}

function createMany(data: Prisma.SuiteTestCaseCreateManyInput[]) {
  return prismaClient.suiteTestCase.createMany({ 
    data,
    skipDuplicates: true
  });
}

function deleteWhere(where: Prisma.SuiteTestCaseWhereInput) {
  return prismaClient.suiteTestCase.deleteMany({ where });
}

export const suiteTestCasesRepository = {
  findBy,
  create,
  createMany,
  deleteWhere
};
