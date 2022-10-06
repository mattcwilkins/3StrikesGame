import { region } from "../../config";
import { S3 } from "@aws-sdk/client-s3";
import { STS } from "@aws-sdk/client-sts";
import { IAM } from "@aws-sdk/client-iam";
import { Lambda } from "@aws-sdk/client-lambda";
import { LambdaDeployer } from "../deployers/LambdaDeployer";
import { RoleDeployer } from "../deployers/RoleDeployer";
import { S3Deployer } from "../deployers/S3Deployer";
import { Deployer } from "../../interfaces/internal/infra/Deployer";

export class Orchestrator implements Deployer {
  public roleDeployer = new RoleDeployer(this);
  public s3Deployer = new S3Deployer(this);
  public lambdaDeployer = new LambdaDeployer(this);

  private accountId: string = "";
  private readonly ready: Promise<void>;

  public constructor(
    public s3 = new S3({ region }),
    public lambda = new Lambda({ region }),
    public iam = new IAM({ region }),
    public sts = new STS({ region })
  ) {
    this.ready = new Promise(async (resolve, reject) => {
      const accountId = (await sts.getCallerIdentity({})).Account!;
      this.setAccountId(accountId);
      resolve();
    });
  }

  public async deploy() {
    await this.ready;
    const { roleDeployer, lambdaDeployer, s3Deployer } = this;

    await roleDeployer.deploy();
    await s3Deployer.deploy();
    await lambdaDeployer.deploy();
  }

  public async destroy() {
    await this.ready;
    const { roleDeployer, lambdaDeployer, s3Deployer } = this;

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
}
