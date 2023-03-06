import { Deployer } from "../../interfaces/internal/infra/Deployer";
import { IntegrationType } from "@aws-sdk/client-api-gateway";
import { RestApi } from "@aws-sdk/client-api-gateway/dist-types/models/models_0";
import { Orchestrator } from "../orchestration/Orchestrator";
import { LambdaDeployer } from "./LambdaDeployer";
import { RoleDeployer } from "./RoleDeployer";
import { region } from "../../config";

/**
 * Deploys API gateway to connect web ui and lambda rest/rpc handlers.
 */
export class ApiGatewayDeployer implements Deployer {
  public static readonly API_NAME = "3-strikes-api-gateway";

  public constructor(private orchestrator: Orchestrator) {}

  public async deploy() {
    await this.deployApiResource("healthcheck");
    await this.deployApiResource("player");
    await this.deployApiResource("team");
    await this.deployApiResource("fantasy");
    await this.deployGateway();
  }

  public async destroy() {
    const { orchestrator } = this;
    const { apig } = orchestrator;

    const apis = await apig.getRestApis({});
    for (const api of apis?.items || []) {
      if (api.name === ApiGatewayDeployer.API_NAME) {
        console.info("Deleting Gateway:", api.id, api.name);
        await apig.deleteRestApi({
          restApiId: api.id,
        });
      }
    }
  }

  public async deployGateway() {
    const { orchestrator } = this;
    const { apig } = orchestrator;

    const apis = await apig.getRestApis({});
    for (const api of apis?.items || []) {
      if (api.name === ApiGatewayDeployer.API_NAME) {
        console.info("API Gateway found:", api.id, api.name);
        const createDeployment = await apig.createDeployment({
          restApiId: api.id,
          stageName: "prod",
        });
        if (api.name) {
          orchestrator.apiGatewayResources[api.name] = api.id!;
        }
        console.info("Deployment created, execution:");
        console.info(
          "\t",
          `https://${api.id}.execute-api.${region}.amazonaws.com/prod`
        );
      }
    }
  }

  public async deployApiResource(
    resourceName: keyof typeof LambdaDeployer.FN_NAMES
  ) {
    const { orchestrator } = this;
    const { apig } = orchestrator;

    let restApiId = "";

    const apis = await apig.getRestApis({});
    for (const api of apis?.items || []) {
      if (api.name === ApiGatewayDeployer.API_NAME) {
        console.info("API Gateway found:", api.id, api.name);
        restApiId = api.id!;
        break;
      }
    }

    if (!restApiId) {
      const api: RestApi = await apig.createRestApi({
        name: ApiGatewayDeployer.API_NAME,
        description: "API Gateway for 3StrikesGame REST",
      });
      restApiId = api.id!;
    }

    const resources = await apig.getResources({
      restApiId,
    });

    const rootResource = resources?.items?.find((item) => item.path === "/");

    if (!rootResource) {
      console.error("Resources:", JSON.stringify(resources, null, 2));
      throw new Error(
        "unable to locate root resource for RestApi: " + restApiId
      );
    }

    const targetResource = resources.items?.find(
      (item) => item.pathPart === resourceName
    );

    let resourceId;

    if (targetResource) {
      console.info(
        "Resource found: ",
        targetResource.id,
        resourceName,
        " - continuing."
      );
      resourceId = targetResource.id!;
      return;
    } else {
      const resource = await apig.createResource({
        restApiId,
        parentId: rootResource.id,
        pathPart: resourceName,
      });
      resourceId = resource.id!;
    }

    const putMethod = await apig.putMethod({
      restApiId,
      resourceId,
      httpMethod: "POST",
      authorizationType: "NONE",
    });

    const putMethodResponse = await apig.putMethodResponse({
      restApiId,
      resourceId,
      httpMethod: "POST",
      statusCode: "200",
    });

    const invocationArn = await orchestrator.getApiGatewayLambdaInvocationArn(
      resourceName
    );

    console.info("Using invocation ARN:", invocationArn);

    await apig.putIntegration({
      restApiId,
      resourceId,
      httpMethod: "POST",
      type: IntegrationType.AWS_PROXY,
      integrationHttpMethod: "POST",
      uri: invocationArn,
      credentials: `arn:aws:iam::${orchestrator.getAccountId()}:role/${
        RoleDeployer.LAMBDA_ROLE_NAME
      }`,
    });

    await apig.putIntegrationResponse({
      restApiId,
      resourceId,
      httpMethod: "POST",
      statusCode: "200",
      responseTemplates: {},
      selectionPattern: "",
    });
  }
}
