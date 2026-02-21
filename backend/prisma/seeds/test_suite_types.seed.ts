import type { PrismaClient } from "../../src/generated/prisma/client";

export async function testSuiteTypesSeed(client: PrismaClient) {
  const types = [
    { value: 'Manual', description: 'Manual test suite' },
    { value: 'Automated', description: 'Automated test suite' },
    { value: 'Exploratory', description: 'Exploratory test suite' },
    { value: 'Regression', description: 'Regression test suite' },
  ];

  const result = await client.testSuiteType.createMany({
    data: types,
    skipDuplicates: true,
  });

  return result;
}
