import { createYoga } from "graphql-yoga";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user.resolver";
import type { BunRequest } from "bun";
import { jwt } from "../jwt/jwt";
import { ProjectResolver } from "./resolvers/project.resolver";
import { TestCaseResolver } from "./resolvers/test-case.resolver";
import { TestResultResolver } from "./resolvers/test-result.resolver";
import { TestSuiteResolver } from "./resolvers/test-suite.resolver";
import { TestSuiteTypeResolver } from "./resolvers/test-suite-type.resolver";
import { TestCaseStatusResolver } from "./resolvers/test-case-status.resolver";
import { TestCasePriorityResolver } from "./resolvers/test-case-priority.resolver";

export type TGraphqlContext = {
  request: BunRequest<"/graphql">;
  user: { id: string; username: string } | null;
};

export async function graphqlInit() {
  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      ProjectResolver,
      TestCaseResolver,
      TestResultResolver,
      TestSuiteResolver,
      TestSuiteTypeResolver,
      TestCaseStatusResolver,
      TestCasePriorityResolver,
    ],
    authChecker: async ({ context }) => {
      const { user } = context as TGraphqlContext;
      return !!user;
    },
  });

  const gqlYoga = createYoga({
    schema,
    context: async ({ request }) => {
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
