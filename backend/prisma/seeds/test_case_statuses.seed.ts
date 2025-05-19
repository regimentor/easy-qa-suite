import type { PrismaClient } from "@prisma/client";

export async function testCaseStatusesSeed(client: PrismaClient) {
  const statuses = [
    { value: 'Draft', description: 'Test case is in draft state' },
    { value: 'Ready', description: 'Test case is ready for execution' },
    { value: 'Deprecated', description: 'Test case is deprecated' },
    { value: 'Blocked', description: 'Test case is blocked' },
    { value: 'Obsolete', description: 'Test case is obsolete' },
  ];

  const result = await client.testCaseStatus.createMany({
    data: statuses,
    skipDuplicates: true,
  });

  return result;
}
