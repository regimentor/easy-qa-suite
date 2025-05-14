import { createYoga, maskError } from "graphql-yoga";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user.resolver";
import { BaseError } from "../errors/base.errors";
import { GraphQLError } from "graphql";

export async function graphqlInit() {
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  const yoga = createYoga({
    schema,
  });

  return { schema, yoga };
}
