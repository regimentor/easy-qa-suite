import type { Prisma } from "../generated/prisma/client";
import { prismaClient } from "../prisma.client";

function findBy(where: Prisma.TestCasePriorityWhereInput) {
  return prismaClient.testCasePriority.findMany({ where });
}

function findById(id: bigint) {
  return prismaClient.testCasePriority.findUnique({
    where: { id },
  });
}

function findByProjectId(projectId: bigint, includeArchived: boolean = false) {
  const where: Prisma.TestCasePriorityWhereInput = { project_id: projectId };
  if (!includeArchived) where.archived = false;
  return prismaClient.testCasePriority.findMany({ where });
}

function findByProjectIdAndValue(projectId: bigint, value: string) {
  return prismaClient.testCasePriority.findUnique({
    where: { project_id_value: { project_id: projectId, value } },
  });
}

function create(data: Prisma.TestCasePriorityCreateInput) {
  return prismaClient.testCasePriority.create({ data });
}

function update(id: bigint, data: Prisma.TestCasePriorityUpdateInput) {
  return prismaClient.testCasePriority.update({
    where: { id },
    data,
  });
}

export const testCasePrioritiesRepository = {
  findBy,
  findById,
  findByProjectId,
  findByProjectIdAndValue,
  create,
  update,
};
