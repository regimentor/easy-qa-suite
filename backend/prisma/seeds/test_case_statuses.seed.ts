import type { PrismaClient } from "../../src/generated/prisma/client";

const STATUSES = [
  { value: "Draft", description: "Test case is in draft state" },
  { value: "Ready", description: "Test case is ready for execution" },
  { value: "Deprecated", description: "Test case is deprecated" },
  { value: "Blocked", description: "Test case is blocked" },
  { value: "Obsolete", description: "Test case is obsolete" },
];

export async function testCaseStatusesSeed(client: PrismaClient) {
  const projects = await client.project.findMany({ select: { id: true } });
  let count = 0;
  for (const project of projects) {
    await client.testCaseStatus.createMany({
      data: STATUSES.map((s) => ({
        project_id: project.id,
        value: s.value,
        description: s.description,
      })),
    });
    count += STATUSES.length;
  }
  return { count };
}
