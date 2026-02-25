import type { PrismaClient } from "../../src/generated/prisma/client";

const PRIORITIES = [
  { value: "Low", description: "Low priority" },
  { value: "Medium", description: "Medium priority" },
  { value: "High", description: "High priority" },
  { value: "Critical", description: "Critical priority" },
];

export async function testCasePrioritiesSeed(client: PrismaClient) {
  const projects = await client.project.findMany({ select: { id: true } });
  let count = 0;
  for (const project of projects) {
    await client.testCasePriority.createMany({
      data: PRIORITIES.map((p) => ({
        project_id: project.id,
        value: p.value,
        description: p.description,
      })),
    });
    count += PRIORITIES.length;
  }
  return { count };
}
