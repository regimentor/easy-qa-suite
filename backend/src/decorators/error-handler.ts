import { GraphQLError } from "graphql";
import { BaseError } from "../errors/base.errors";

/**
 * Class decorator that applies error handling to all methods in a GraphQL resolver class
 * @returns Class decorator function
 */
export function ErrorHandler() {
  return function <T extends { new (...args: any[]): any }>(constructor: T) {
    const methodNames = Object.getOwnPropertyNames(constructor.prototype);

    for (const methodName of methodNames) {
      // Skip constructor
      if (methodName === 'constructor') continue;

      const descriptor = Object.getOwnPropertyDescriptor(
        constructor.prototype,
        methodName
      );

      if (descriptor && typeof descriptor.value === 'function') {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
          try {
            return await originalMethod.apply(this, args);
          } catch (error) {
            // Handle GraphQL errors as-is
            if (error instanceof GraphQLError) {
              throw error;
            }

            // Convert BaseError to GraphQLError with 400 status
            if (error instanceof BaseError) {
              throw new GraphQLError(error.message, {
                extensions: {
                  code: "BAD_REQUEST",
                  http: {
                    status: 400,
                  },
                },
              });
            }

            // Handle unknown errors with 500 status
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            throw new GraphQLError(errorMessage, {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
                http: {
                  status: 500,
                },
              },
            });
          }
        };

        Object.defineProperty(constructor.prototype, methodName, descriptor);
      }
    }

    return constructor;
  };
}
