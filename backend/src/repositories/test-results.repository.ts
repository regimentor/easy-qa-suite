import { Prisma } from ".prisma/client";
import { prismaClient } from "../prisma.client";

function findBy(where: Prisma.TestResultWhereInput) {
  return prismaClient.testResult.findMany({ where });
}

function firstFindBy(where: Prisma.TestResultWhereInput) {
  return prismaClient.testResult.findFirst({ where });
}

function create(data: Prisma.TestResultCreateInput) {
  return prismaClient.testResult.create({ data });
}

export const testResultsRepository = {
  findBy,
  firstFindBy,
  create
};
