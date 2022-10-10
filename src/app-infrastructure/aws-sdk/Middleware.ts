import { MiddlewareStack } from "@aws-sdk/types";

/**
 * Hooks into the AWS SDK middleware stack.
 */
export class Middleware {
  public static requestSummaryMiddleware(
    middlewareStack: MiddlewareStack<any, any>
  ) {
    const debug = (next: any, context: any) => async (args: any) => {
      const start = Date.now();
      const result = await next(args);
      const end = Date.now();
      const request = args.request;
      const response = result.response;
      if (request && response) {
        console.info(
          "\t",
          `${context.clientName}::${context.commandName} - ${
            response.statusCode
          } ${request.method} ${request.hostname + request.path} - ${
            end - start
          } ms`
          // {
          //   ...request.headers,
          // },
          // {
          //   ...response.headers,
          // }
        );
      } else {
        console.log({
          request,
          response,
        });
      }
      return result;
    };
    middlewareStack.add(debug, {
      step: "deserialize",
      priority: "low",
      tags: ["ROUND_TRIP"],
      name: "UserRoundTripInfo",
    });
  }
}
