import { usersSeed } from "./seeds/users.seed";
import { projectsSeed } from "./seeds/projects.seed";
import { testCasesSeed } from "./seeds/test_cases.seed";
import { testResultsSeed } from "./seeds/test_results.seed";
import { testSuitesSeed } from "./seeds/test_suites.seed";
import { suiteTestCasesSeed } from "./seeds/suite_test_cases.seed";
import { testCasePrioritiesSeed } from "./seeds/test_case_priorities.seed";
import { testCaseStatusesSeed } from "./seeds/test_case_statuses.seed";
import { testSuiteTypesSeed } from "./seeds/test_suite_types.seed";
import { prismaClient } from "../src/prisma.client";

async function main() {
  await testCasePrioritiesSeed(prismaClient);
  await testCaseStatusesSeed(prismaClient);
  await testSuiteTypesSeed(prismaClient);
  await usersSeed(prismaClient);
  await projectsSeed(prismaClient);
  await testCasesSeed(prismaClient);
  await testResultsSeed(prismaClient);
  await testSuitesSeed(prismaClient);
  await suiteTestCasesSeed(prismaClient);
}

main()
  .then(() => {
    console.log("Seeding completed successfully. 😎");
  })
  .catch((error) => {
    console.error("Error seeding the database: ☹️", error);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
