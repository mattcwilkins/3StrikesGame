import path from "path";

export class FnPackager {
  public constructor() {}

  public async deploy(lambdaFnName: string) {
    const distRoot = path.join(__dirname, "..", "..");
    const handlerFilePath = path.join(
      distRoot,
      "app-server",
      "lambda",
      lambdaFnName + ".js"
    );
    throw new Error("WIP");
  }
}
