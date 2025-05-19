import { Prisma } from ".prisma/client";
import { prismaClient } from "../prisma.client";

function findBy(where: Prisma.TestCasePriorityWhereInput) {
  return prismaClient.testCasePriority.findMany({ where });
}

function findById(id: bigint) {
  return prismaClient.testCasePriority.findUnique({ 
    where: { id } 
  });
}

function findByValue(value: string) {
  return prismaClient.testCasePriority.findUnique({ 
    where: { value } 
  });
}

function create(data: Prisma.TestCasePriorityCreateInput) {
  return prismaClient.testCasePriority.create({ data });
}

function update(id: bigint, data: Prisma.TestCasePriorityUpdateInput) {
  return prismaClient.testCasePriority.update({
    where: { id },
    data
  });
}

export const testCasePrioritiesRepository = {
  findBy,
  findById,
  findByValue,
  create,
  update
};
