import { GetFunctionResponse, Runtime } from "@aws-sdk/client-lambda";
import { RoleDeployer } from "./RoleDeployer";
import { GetRoleResponse } from "@aws-sdk/client-iam";
import { Orchestrator } from "../orchestration/Orchestrator";
import { S3Deployer } from "./S3Deployer";
import { Deployer } from "../../interfaces/internal/infra/Deployer";

export class LambdaDeployer implements Deployer {
  public static readonly FN_NAMES = {
    healthcheck: "3StrikesGame-fn-healthcheck",
    getPlayerList: "3StrikesGame-fn-getPlayerList",
    loadPlayerList: "3StrikesGame-fn-loadPlayerList",
  };

  public constructor(private orchestrator: Orchestrator) {}

  public async deploy() {
    await this.deployHandler("lambda-rest", "healthcheck");
    await this.deployHandler("lambda-rest", "getPlayerList");
    await this.deployHandler("lambda-worker", "loadPlayerList");
  }

  public async destroy() {
    await this.deleteHandler(LambdaDeployer.FN_NAMES.healthcheck);
  }

  public async deployHandler(
    handlerFolder: string,
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
        Handler: `dist/app-server/${handlerFolder}/${handlerName}.handler`,
      });
      console.info("Function created:", handlerName);
    }
  }

  public async deleteHandler(functionName: string) {
    const { lambda } = this.orchestrator;
    await lambda
      .deleteFunction({
        FunctionName: functionName,
      })
      .catch(() => null);
  }
}
