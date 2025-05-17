import type { BunRequest } from "bun";
import { logger } from "../logger/logger";

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

export function handler(
  fn: IHandler,
  { beforeHandler }: { beforeHandler: IMiddleware[] } = { beforeHandler: [] },
) {
  return async (req: BunRequest): Promise<Response> => {
    // Call all the functions in the handlerBefore array
    let ctx = {};
    for (const fn of beforeHandler) {
      const r = await fn({ req, ctx });
      ctx = { ...ctx, ...r };
    }

    // Call the main function and return its result
    try {
      const res = await fn({ req, ctx });
      if (res.type === "text") {
        return new Response(res.data, {
          status: res.status,
          headers: {
            "Content-Type": "text/plain",
          },
        });
      }

      return new Response(JSON.stringify(res.data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      logger.error("Error in handler", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  };
}
