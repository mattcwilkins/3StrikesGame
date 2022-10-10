import {
  GetFunctionConfigurationCommandOutput,
  Runtime,
  waitUntilFunctionUpdated,
} from "@aws-sdk/client-lambda";
import { RoleDeployer } from "./RoleDeployer";
import { GetRoleResponse } from "@aws-sdk/client-iam";
import { Orchestrator } from "../orchestration/Orchestrator";
import { S3Deployer } from "./S3Deployer";
import { Deployer } from "../../interfaces/internal/infra/Deployer";

/**
 * Deploys rest/rpc and worker lambda functions.
 */
export class LambdaDeployer implements Deployer {
  public static readonly FN_NAMES = {
    healthcheck: "3StrikesGame-fn-healthcheck",
    player: "3StrikesGame-fn-player",
    team: "3StrikesGame-fn-team",
    loader: "3StrikesGame-fn-loader",
  };

  public constructor(private orchestrator: Orchestrator) {}

  public async deploy() {
    await this.deployHandler("lambda-rest", "healthcheck");
    await this.deployHandler("lambda-rest", "player");
    await this.deployHandler("lambda-rest", "team");
    await this.deployHandler("lambda-worker", "loader");
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
    const handler = `dist/app-server/${handlerFolder}/${handlerName}.handler`;

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

    const getFn: null | GetFunctionConfigurationCommandOutput = await lambda
      .getFunctionConfiguration({
        FunctionName: fnName,
      })
      .catch(() => null);

    if (getFn) {
      console.info("Function exists:", fnName);

      if (getFn.Handler !== handler) {
        await lambda.updateFunctionConfiguration({
          FunctionName: fnName,
          Handler: handler,
        });
        console.info("upading handler name to", handler);
        await waitUntilFunctionUpdated(
          {
            client: lambda,
            maxWaitTime: 60,
          },
          {
            FunctionName: fnName,
          }
        );
      }

      await lambda.updateFunctionCode({
        FunctionName: fnName,
        S3Bucket: S3Deployer.LAMBDA_BUCKET(orchestrator.getAccountId()),
        S3Key: S3Deployer.LAMBDA_ZIP_FILENAME,
      });
      console.info("Function code/configuration updated:", handlerName);
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
        Handler: handler,
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
