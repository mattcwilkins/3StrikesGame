import { Context, Handler } from "aws-lambda";

export const handler: Handler<{}> = async (event: {}, context: Context) => {
  console.log("OK");

  // TODO APIG integration status/headers/body
  return {
    statusCode: 200,
    headers: {
      healthcheck: "OK",
    },
    body: JSON.stringify({
      healthcheck: "OK",
    }),
  };
};
