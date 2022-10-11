import { region } from "../../config";
import { S3 } from "@aws-sdk/client-s3";
import { STS } from "@aws-sdk/client-sts";
import { IAM } from "@aws-sdk/client-iam";
import { Lambda } from "@aws-sdk/client-lambda";
import { LambdaDeployer } from "../deployers/LambdaDeployer";
import { RoleDeployer } from "../deployers/RoleDeployer";
import { S3Deployer } from "../deployers/S3Deployer";
import { Deployer } from "../../interfaces/internal/infra/Deployer";
import { APIGateway } from "@aws-sdk/client-api-gateway";
import { ApiGatewayDeployer } from "../deployers/ApiGatewayDeployer";
import { Middleware } from "../aws-sdk/Middleware";

/**
 * Orchestration controller for the various deployer classes.
 */
export class Orchestrator implements Deployer {
  public roleDeployer = new RoleDeployer(this);
  public s3Deployer = new S3Deployer(this);
  public lambdaDeployer = new LambdaDeployer(this);
  public apiGatewayDeployer = new ApiGatewayDeployer(this);

  private accountId: string = "";
  public readonly apiGatewayResources: Record<string, string> = {};
  private readonly ready: Promise<void>;

  public constructor(
    public s3 = new S3({ region }),
    public lambda = new Lambda({ region }),
    public iam = new IAM({ region }),
    public sts = new STS({ region }),
    public apig = new APIGateway({ region })
  ) {
    for (const client of [s3, lambda, iam, sts, apig]) {
      Middleware.requestSummaryMiddleware(client.middlewareStack as any);
    }
    this.ready = new Promise(async (resolve, reject) => {
      const accountId = (await sts.getCallerIdentity({})).Account!;
      this.setAccountId(accountId);
      resolve();
    });
  }

  public async deploy() {
    await this.ready;
    const { roleDeployer, lambdaDeployer, s3Deployer, apiGatewayDeployer } =
      this;

    await roleDeployer.deploy();
    await s3Deployer.deploy();
    await lambdaDeployer.deploy();
    await apiGatewayDeployer.deploy();
  }

  public async deployWebUiOnly() {
    await this.ready;
    const { s3Deployer } = this;
    await s3Deployer.deploy();
  }

  public async destroy() {
    await this.ready;
    const { roleDeployer, lambdaDeployer, s3Deployer, apiGatewayDeployer } =
      this;

    await apiGatewayDeployer.destroy();
    await lambdaDeployer.destroy();
    await s3Deployer.destroy();
    await roleDeployer.destroy();
  }

  public setAccountId(id: string) {
    this.accountId = id;
  }

  public getAccountId(): string {
    if (this.accountId) {
      return this.accountId;
    }
    throw new Error("Account ID has not been set.");
  }

  public async getApiGatewayLambdaInvocationArn(
    resourceName: keyof typeof LambdaDeployer.FN_NAMES
  ) {
    const { lambda } = this;
    const fn = await lambda.getFunctionConfiguration({
      FunctionName: LambdaDeployer.FN_NAMES[resourceName],
    });
    return `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:${this.getAccountId()}:function:${
      fn.FunctionName
    }/invocations`;
  }
}
