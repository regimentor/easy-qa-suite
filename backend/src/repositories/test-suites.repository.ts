import { Prisma } from ".prisma/client";
import { prismaClient } from "../prisma.client";

function findBy(where: Prisma.TestSuiteWhereInput) {
  return prismaClient.testSuite.findMany({ where });
}

function firstFindBy(where: Prisma.TestSuiteWhereInput) {
  return prismaClient.testSuite.findFirst({ where });
}

function create(data: Prisma.TestSuiteCreateInput) {
  return prismaClient.testSuite.create({ data });
}

export const testSuitesRepository = {
  findBy,
  firstFindBy,
  create
};
