import { Prisma } from ".prisma/client";
import { prismaClient } from "../prisma.client";

function findBy(where: Prisma.TestSuiteTypeWhereInput) {
  return prismaClient.testSuiteType.findMany({ where });
}

function findById(id: bigint) {
  return prismaClient.testSuiteType.findUnique({
    where: { id },
  });
}

function findByValue(value: string) {
  return prismaClient.testSuiteType.findUnique({
    where: { value },
  });
}

function create(data: Prisma.TestSuiteTypeCreateInput) {
  return prismaClient.testSuiteType.create({ data });
}

function update(id: bigint, data: Prisma.TestSuiteTypeUpdateInput) {
  return prismaClient.testSuiteType.update({
    where: { id },
    data,
  });
}

export const testSuiteTypesRepository = {
  findBy,
  findById,
  findByValue,
  create,
  update,
};
