import {
  AttachedPolicy,
  CreateRoleResponse,
  GetRoleResponse,
} from "@aws-sdk/client-iam";
import { Orchestrator } from "../orchestration/Orchestrator";
import { Deployer } from "../../interfaces/internal/infra/Deployer";

export class RoleDeployer implements Deployer {
  public static readonly LAMBDA_ROLE_NAME = "3Strikes-LambdaRole";

  public constructor(private orchestrator: Orchestrator) {}

  public async deploy() {
    await this.deployLambdaRole();
  }

  public async destroy() {
    const { orchestrator } = this;
    const { iam } = orchestrator;
    await iam
      .deleteRole({
        RoleName: RoleDeployer.LAMBDA_ROLE_NAME,
      })
      .catch(() => {});
  }

  public async deployLambdaRole() {
    const { orchestrator } = this;
    const { iam } = orchestrator;
    const roleName = RoleDeployer.LAMBDA_ROLE_NAME;
    let role: null | GetRoleResponse | CreateRoleResponse = await iam
      .getRole({
        RoleName: roleName,
      })
      .catch(() => null);

    if (!role) {
      console.info("Creating role", roleName);
      await iam.createRole({
        RoleName: roleName,
        Path: "/",
        Description:
          "Allows 3Strikes lambda functions to access other services.",
        AssumeRolePolicyDocument: JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: ["sts:AssumeRole"],
              Principal: {
                Service: ["lambda.amazonaws.com"],
              },
            },
          ],
        }),
      });
    } else {
      console.info("Role exists", roleName);
    }

    const listAttachedRolePolicies = await iam.listAttachedRolePolicies({
      RoleName: roleName,
    });
    const policies = listAttachedRolePolicies.AttachedPolicies || [];

    const existingPolicies = policies.reduce(
      (acc: Record<string, boolean>, cur: AttachedPolicy) => {
        if (cur.PolicyName) {
          acc[cur.PolicyName] = true;
        }
        return acc;
      },
      {} as Record<string, boolean>
    );

    const required = [
      "AmazonDynamoDBFullAccess",
      "CloudWatchFullAccess",
      "AWSLambda_FullAccess",
      "AmazonS3FullAccess",
    ];

    for (const requiredPolicy of required) {
      if (!existingPolicies[requiredPolicy]) {
        console.info("Attaching policy to role", requiredPolicy, roleName);
        await iam.attachRolePolicy({
          RoleName: roleName,
          PolicyArn: `arn:aws:iam::aws:policy/${requiredPolicy}`,
        });
      } else {
        console.info("Policy exists on role", requiredPolicy, roleName);
      }
    }
  }
}
