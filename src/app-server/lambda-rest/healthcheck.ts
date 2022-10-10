import { Context, Handler } from "aws-lambda";

/**
 * Dummy response.
 */
export const handler: Handler<{}> = async (event: {}, context: Context) => {
  console.log("OK");

  return {
    statusCode: 200,
    headers: {
      healthcheck: "OK",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: JSON.stringify({
      healthcheck: "OK",
    }),
  };
};
