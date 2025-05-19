import { PrismaClient } from "@prisma/client";
import { usersSeed } from "./seeds/users.seed";
import { projectsSeed } from "./seeds/projects.seed";
import { testCasesSeed } from "./seeds/test_cases.seed";
import { testResultsSeed } from "./seeds/test_results.seed";
import { testSuitesSeed } from "./seeds/test_suites.seed";
import { suiteTestCasesSeed } from "./seeds/suite_test_cases.seed";
const client = new PrismaClient();
async function main() {
  await usersSeed(client);
  await projectsSeed(client);
  await testCasesSeed(client);
  await testResultsSeed(client);
  await testSuitesSeed(client);
  await suiteTestCasesSeed(client);
}

main()
  .then(() => {
    console.log("Seeding completed successfully. 😎");
  })
  .catch((error) => {
    console.error("Error seeding the database: ☹️", error);
  })
  .finally(async () => {
    await client.$disconnect();
  });
