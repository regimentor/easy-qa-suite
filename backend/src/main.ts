import { config } from "./config";
import { graphqlInit } from "./graphql/graphql";

export async function main() {
  const { gqlYoga } = await graphqlInit();

  Bun.serve({
    port: config.webPort,
    routes: {
      "/": (req) => {
        return new Response("Hello World");
      },
      "/graphql": {
        GET: (req) => {
          return gqlYoga.fetch(req);
        },
        POST: (req) => {
          return gqlYoga.fetch(req);
        },
      },
    },
  });
}
