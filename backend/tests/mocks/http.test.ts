import { mock } from "bun:test";

// Simple mock for HTTP requests
export function createMockRequest(options: {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  body?: any;
  query?: Record<string, string>;
}) {
  const body = options.body || {};
  
  return {
    method: options.method || "GET",
    url: options.url || "http://localhost:3000/",
    headers: new Headers(options.headers || {}),
    json: mock(() => Promise.resolve(body)),
    text: mock(() => Promise.resolve(typeof body === 'string' ? body : JSON.stringify(body))),
    query: options.query || {},
  };
}

// Mock Context object
export function createMockContext(options: {
  params?: Record<string, string>;
  user?: { id: string; username: string } | null;
  [key: string]: any;
}) {
  return {
    params: options.params || {},
    user: options.user || null,
    ...options,
  };
}

// Mock HTTP handler parameters - using type assertion to bypass TypeScript checks
export function createMockHandlerParams(options: {
  req?: ReturnType<typeof createMockRequest>;
  ctx?: ReturnType<typeof createMockContext>;
} = {}) {
  return {
    req: options.req || createMockRequest({}),
    ctx: options.ctx || createMockContext({}),
  } as any; // Type assertion to make TypeScript happy
}