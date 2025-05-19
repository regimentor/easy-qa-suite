import { Prisma } from ".prisma/client";
import { prismaClient } from "../prisma.client";

function findBy(where: Prisma.TestCaseStatusWhereInput) {
  return prismaClient.testCaseStatus.findMany({ where });
}

function findById(id: bigint) {
  return prismaClient.testCaseStatus.findUnique({ 
    where: { id } 
  });
}

function findByValue(value: string) {
  return prismaClient.testCaseStatus.findUnique({ 
    where: { value } 
  });
}

function create(data: Prisma.TestCaseStatusCreateInput) {
  return prismaClient.testCaseStatus.create({ data });
}

function update(id: bigint, data: Prisma.TestCaseStatusUpdateInput) {
  return prismaClient.testCaseStatus.update({
    where: { id },
    data
  });
}

export const testCaseStatusesRepository = {
  findBy,
  findById,
  findByValue,
  create,
  update
};
