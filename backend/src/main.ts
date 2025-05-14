import express from "express";
import { config } from "./config";

import { graphqlInit } from "./graphql/graphql";

export async function main() {
  const { yoga } = await graphqlInit();

  const app = express();
  app.use("/graphql", yoga);

  app.listen(config.webPort, () => {
    console.log(`Server is running on port ${config.webPort} 🚀`);
  });
}
