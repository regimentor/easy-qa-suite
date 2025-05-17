import { config } from "./config";
import { graphqlInit } from "./graphql/graphql";
import { handler } from "./http/handler";
import { refreshTokenPost } from "./http/handlers/refresh-token.post";
import { signInPost } from "./http/handlers/sign-in.post";
import { logger } from "./logger/logger";

export async function main() {
  const { gqlYoga } = await graphqlInit();

  Bun.serve({
    development: Bun.env.NODE_ENV !== "production",
    port: config.webPort,
    /**
     * Global error handler
     * @param error
     * @returns
     */
    error(error) {
      logger.error(error);
      return new Response("Internal Server Error", { status: 500 });
    },
    routes: {
      "/": handler(
        async () => {
          return { data: "Hello", status: 200 };
        },
        {
          beforeHandler: [
            async ({ req, ctx }) => {
              return {
                heello: "world",
              };
            },
            async ({ req, ctx }) => {
              return {
                gun: "drive +" + ctx.heello,
              };
            },
            async ({ req, ctx }) => console.log(req, ctx),
          ],
        },
      ),
      "/sign-in": {
        POST: handler(signInPost),
      },
      "/refresh-token": {
        POST: handler(refreshTokenPost),
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
