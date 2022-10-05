import { GetFunctionResponse, Lambda } from "@aws-sdk/client-lambda";
import credentials from "../../credentials.json";
import { RoleDeployer } from "./RoleDeployer";
import { GetRoleResponse, IAM } from "@aws-sdk/client-iam";

const { region, secretAccessKey, accessKeyId } = credentials;

export class LambdaDeployer {
  public static readonly FN_NAMES = {
    HEALTHCHECK: "3StrikesGame-fn-healthcheck",
  };

  public constructor(
    private lambda = new Lambda({
      region,
      credentials: {
        secretAccessKey,
        accessKeyId,
      },
    }),
    private iam = new IAM({
      region,
      credentials: {
        secretAccessKey,
        accessKeyId,
      },
    })
  ) {}

  public async deploy() {
    await this.deployHealthcheck();
  }

  public async deployHealthcheck() {
    const { iam, lambda } = this;
    const roleName = RoleDeployer.LAMBDA_ROLE_NAME;
    const fnName = LambdaDeployer.FN_NAMES.HEALTHCHECK;

    const getRole: null | GetRoleResponse = await iam
      .getRole({
        RoleName: roleName,
      })
      .catch(() => null);
    if (!getRole) {
      throw new Error("Role not found, deploy it first.");
    } else {
      console.info("Role found", roleName);
    }

    const getFn: null | GetFunctionResponse = await lambda
      .getFunction({
        FunctionName: fnName,
      })
      .catch(() => null);
    if (getFn) {
      console.info("Function exists", fnName);
    } else {
      throw new Error("WIP");
      // await lambda.createFunction({
      //   FunctionName: fnName,
      // });
    }
  }
}
