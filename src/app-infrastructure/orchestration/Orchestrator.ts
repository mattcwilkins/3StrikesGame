import { region } from "../../config";
import { S3 } from "@aws-sdk/client-s3";
import { STS } from "@aws-sdk/client-sts";
import { IAM } from "@aws-sdk/client-iam";
import { Lambda } from "@aws-sdk/client-lambda";
import { LambdaDeployer } from "../deployers/LambdaDeployer";
import { RoleDeployer } from "../deployers/RoleDeployer";
import { S3Deployer } from "../deployers/S3Deployer";

export class Orchestrator {
  private accountId: string = "";
  public roleDeployer = new RoleDeployer(this);
  public s3Deployer = new S3Deployer(this);
  public lambdaDeployer = new LambdaDeployer(this);

  public constructor(
    public s3 = new S3({ region }),
    public lambda = new Lambda({ region }),
    public iam = new IAM({ region }),
    public sts = new STS({ region })
  ) {}

  public async deploy() {
    const { roleDeployer, lambdaDeployer, s3Deployer } = this;
    await roleDeployer.deploy();
    await s3Deployer.deploy();
    await lambdaDeployer.deploy();
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
