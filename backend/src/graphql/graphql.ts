import { createYoga } from "graphql-yoga";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user.resolver";
import { createLogger, type Logger } from "../logger/logger";
import type { BunRequest } from "bun";

export type TGraphqlContext = {
  request: BunRequest;
};

export async function graphqlInit() {
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  const gqlYoga = createYoga({
    schema,
    context: ({ request }) => {
      return {
        request,
      };
    },
  });

  return { schema, gqlYoga };
}
