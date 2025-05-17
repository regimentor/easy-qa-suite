import { createResolverClassMiddlewareDecorator } from "type-graphql";

export function AuthGuard() {
  return createResolverClassMiddlewareDecorator(async ({ args }, next) => {
    console.log(args);

    return next();
  });
}
