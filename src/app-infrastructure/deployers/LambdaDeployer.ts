import { GetFunctionResponse } from "@aws-sdk/client-lambda";
import { RoleDeployer } from "./RoleDeployer";
import { GetRoleResponse } from "@aws-sdk/client-iam";
import { Orchestrator } from "../orchestration/Orchestrator";
import { S3Deployer } from "./S3Deployer";
import { Runtime } from "@aws-sdk/client-lambda";

export class LambdaDeployer {
  public static readonly FN_NAMES = {
    healthcheck: "3StrikesGame-fn-healthcheck",
  };

  public constructor(private orchestrator: Orchestrator) {}

  public async deploy() {
    await this.deployHandler("healthcheck");
  }

  public async deployHandler(
    handlerName: keyof typeof LambdaDeployer.FN_NAMES
  ) {
    const { orchestrator } = this;
    const { iam, lambda } = orchestrator;
    const roleName = RoleDeployer.LAMBDA_ROLE_NAME;
    const fnName = LambdaDeployer.FN_NAMES[handlerName];

    const getRole: null | GetRoleResponse = await iam
      .getRole({
        RoleName: roleName,
      })
      .catch(() => null);
    if (!getRole) {
      throw new Error("Role not found, deploy it first with the RoleDeployer.");
    } else {
      console.info("Role found", roleName);
    }

    const roleArn = getRole.Role!.Arn!;

    const getFn: null | GetFunctionResponse = await lambda
      .getFunction({
        FunctionName: fnName,
      })
      .catch(() => null);
    if (getFn) {
      console.info("Function exists:", fnName);
      await lambda.updateFunctionCode({
        FunctionName: fnName,
        S3Bucket: S3Deployer.LAMBDA_BUCKET(orchestrator.getAccountId()),
        S3Key: S3Deployer.LAMBDA_ZIP_FILENAME,
      });
      console.info("Function code updated:", handlerName);
    } else {
      await lambda.createFunction({
        FunctionName: fnName,
        Role: roleArn,
        Code: {
          S3Bucket: S3Deployer.LAMBDA_BUCKET(orchestrator.getAccountId()),
          S3Key: S3Deployer.LAMBDA_ZIP_FILENAME,
        },
        Runtime: Runtime.nodejs16x,
        Description: `${handlerName} handler for 3StrikesGame`,
        Handler: `dist/app-server/lambda/${handlerName}.handler`,
      });
      console.info("Function created:", handlerName);
    }
  }
}
