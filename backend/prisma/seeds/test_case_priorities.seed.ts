import type { PrismaClient } from "@prisma/client";

export async function testCasePrioritiesSeed(client: PrismaClient) {
  const priorities = [
    { value: 'Low', description: 'Low priority' },
    { value: 'Medium', description: 'Medium priority' },
    { value: 'High', description: 'High priority' },
    { value: 'Critical', description: 'Critical priority' },
  ];

  const result = await client.testCasePriority.createMany({
    data: priorities,
    skipDuplicates: true,
  });

  return result;
}
