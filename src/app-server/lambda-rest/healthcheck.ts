import { Context, Handler } from "aws-lambda";

export const handler: Handler<{}, string> = async (
  event: {},
  context: Context
) => {
  console.log("OK");
  return "OK";
};
