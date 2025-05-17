import { createYoga } from "graphql-yoga";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user.resolver";
import type { BunRequest } from "bun";
import { jwt } from "../jwt/jwt";

export type TGraphqlContext = {
  request: BunRequest<"/graphql">;
  user: { id: string; username: string } | null;
};

export async function graphqlInit() {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    authChecker: async ({ context }) => {
      const { user } = context as TGraphqlContext;
      return !!user;
    },
  });

  const gqlYoga = createYoga({
    schema,
    context: async ({ request }) => {
      console.log((request as BunRequest).cookies, "cookies");
      console.log(request.headers, "headers");
      let user = null;
      const token = request.headers.get("Authorization")?.split(" ")[1];
      if (token) {
        const tokenClaims = await jwt.verifyToken(token);
        if (tokenClaims) {
          user = {
            id: tokenClaims.id,
            username: tokenClaims.username,
          };
        }
      }

      return {
        request,
        user,
      };
    },
  });

  return { schema, gqlYoga };
}
