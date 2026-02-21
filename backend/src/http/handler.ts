import type { BunRequest } from "bun";
import { logger } from "../logger/logger";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function corsPreflightResponse(): Response {
  return new Response(null, { status: 204, headers: corsHeaders });
}

const jsonFallback = (_: unknown, val: unknown): unknown => {
  if (typeof val === "bigint") {
    return val.toString();
  }
  return val;
};

export type HandlerContext = Record<string, unknown>;

export interface IHandlerResponse<T = unknown> {
  data: T;
  status: number;
  type?: "json" | "text";
}

interface IMiddleware {
  (q: { req: BunRequest; ctx: HandlerContext }): Promise<Partial<HandlerContext>>;
}

export interface IHandler {
  (
    q: { req: BunRequest; ctx: HandlerContext },
  ): Promise<IHandlerResponse<unknown>>;
}

interface IHandlerOptions {
  beforeHandler?: IMiddleware[];
  cors?: boolean;
  name?: string;
}

const isProduction = () => Bun.env.NODE_ENV === "production";

function safeRequestLogLabel(req: BunRequest, handlerName: string): string {
  const base = `[Request (${handlerName})]: ${req.method} ${req.url}`;
  if (isProduction()) {
    return base;
  }
  const h = JSON.stringify(req.headers);
  const c = JSON.stringify(req.cookies);
  return `${base}\n headers: ${h}\n cookies: ${c}`;
}

function errorResponse(
  req: BunRequest,
  headers: Record<string, string>,
): Response {
  const wantsJson = req.headers.get("Accept")?.includes("application/json");
  const status = 500;
  if (wantsJson) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
  }
  return new Response("Internal Server Error", {
    status,
    headers: { "Content-Type": "text/plain", ...headers },
  });
}

export function handler(
  fn: IHandler,
  { beforeHandler = [], cors = false, name: optionName }: IHandlerOptions = {},
) {
  const handlerName = optionName ?? fn.name ?? "anonymous";
  logger.info(`Handler initialized ${handlerName}`);

  return async (req: BunRequest): Promise<Response> => {
    const headers: Record<string, string> = cors ? { ...corsHeaders } : {};
    logger.debug(safeRequestLogLabel(req, handlerName));

    try {
      let ctx: HandlerContext = {};
      for (const mw of beforeHandler) {
        const r = await mw({ req, ctx });
        ctx = { ...ctx, ...r };
      }

      const res = await fn({ req, ctx });

      if (res.type === "text") {
        return new Response(res.data as string, {
          status: res.status,
          headers: {
            "Content-Type": "text/plain",
            ...headers,
          },
        });
      }

      logger.debug(
        `[Response (${handlerName})]: ${JSON.stringify(res.data, jsonFallback)} ${res.status}`,
      );
      return new Response(JSON.stringify(res.data, jsonFallback), {
        status: res.status,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });
    } catch (error) {
      logger.error("Error in http.handler", error);
      return errorResponse(req, headers);
    }
  };
}
