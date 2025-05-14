import { createYoga } from "graphql-yoga";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user.resolver";
import { createLogger, type Logger } from "../logger/logger";

export type TGraphqlContext = {
  logger: Logger;
};

export async function graphqlInit() {
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  const logger = createLogger({ meta: "graphql" });

  const yoga = createYoga({
    schema,
    context: () => ({
      logger,
    }),
  });

  return { schema, yoga };
}
