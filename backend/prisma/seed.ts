import { PrismaClient } from "@prisma/client";
import { usersSeed } from "./seeds/users.seed";
const client = new PrismaClient();
async function main() {
  await usersSeed(client);
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
