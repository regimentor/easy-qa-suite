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
    fetch(req) {
      if (req.method === "OPTIONS") {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      }

      logger.debug(`[Request] ${req.method} ${req.url}`);
      console.log(req);

      return new Response("Not Found", {
        status: 404,
      });
    },
    routes: {
      "/login": {
        POST: handler(signInPost, { cors: true }),
      },
      "/refresh-token": {
        POST: handler(refreshTokenPost, { cors: true }),
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
