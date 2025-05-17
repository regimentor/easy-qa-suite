import type { BunRequest } from "bun";
import { logger } from "../logger/logger";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

interface IHandlerResponse {
  data: any;
  status: number;
  type?: "json" | "text";
}

interface IMiddleware {
  (q: { req: BunRequest; ctx: any }): Promise<any>;
}

export interface IHandler {
  (q: { req: BunRequest; ctx: any }): Promise<IHandlerResponse>;
}

interface IHandlerOptions {
  beforeHandler?: IMiddleware[];
  cors?: boolean;
}

export function handler(
  fn: IHandler,
  { beforeHandler = [], cors = false }: IHandlerOptions
) {
  logger.info(`Handler initialized ${fn.name}`);
  return async (req: BunRequest): Promise<Response> => {
    // Call all the functions in the handlerBefore array
    let ctx = {};
    for (const fn of beforeHandler) {
      const r = await fn({ req, ctx });
      ctx = { ...ctx, ...r };
    }

    let headers = {};
    if (cors) {
      headers = {
        ...corsHeaders,
      };
    }
    const h = JSON.stringify(req.headers);
    const c = JSON.stringify(req.cookies);
    logger.debug(
      `[Request (${fn.name})]: \n ${req.method} ${req.url} \n headers: ${h} \n cookies: ${c}`
    );
    // Call the main function and return its result
    try {
      const res = await fn({ req, ctx });
      if (res.type === "text") {
        return new Response(res.data, {
          status: res.status,
          headers: {
            "Content-Type": "text/plain",
            ...headers,
          },
        });
      }

      logger.debug(
        `[Response (${fn.name})]: ${JSON.stringify(res.data)} ${res.status}`
      );
      return new Response(JSON.stringify(res.data), {
        status: res.status,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });
    } catch (error) {
      logger.error("Error in handler", error);
      return new Response("Internal Server Error", { status: 500, ...headers });
    }
  };
}
