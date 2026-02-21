import { config } from "./config";
import { graphqlInit } from "./graphql/graphql";
import { corsPreflightResponse, handler } from "./http/handler";
import { refreshTokenPost } from "./http/handlers/refresh-token.post";
import { signInPost } from "./http/handlers/sign-in.post";
import { logger } from "./logger/logger";

export async function main(): Promise<void> {
  const { gqlYoga } = await graphqlInit();

  const server = Bun.serve({
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
        return corsPreflightResponse();
      }

      logger.debug(`[Request] ${req.method} ${req.url}`);
      logger.warn(`[404] ${req.method} ${req.url}`);

      const wantsJson = req.headers.get("Accept")?.includes("application/json");
      if (wantsJson) {
        return new Response(JSON.stringify({ error: "Not Found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response("Not Found", { status: 404 });
    },
    routes: {
      "/login": {
        POST: handler(signInPost, { cors: true, name: "POST /login" }),
      },
      "/refresh-token": {
        POST: handler(refreshTokenPost, { cors: true, name: "POST /refresh-token" }),
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

  logger.info(`Server listening on port ${server.port}`);
}
