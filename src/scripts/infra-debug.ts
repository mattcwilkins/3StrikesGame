#!/usr/bin/env node

import { Orchestrator } from "../app-infrastructure/orchestration/Orchestrator";

(async () => {
  const orch = new Orchestrator();

  // await orch.apiGatewayDeployer.destroy();
  await orch.apiGatewayDeployer.deployApiResource("healthcheck");
  await orch.apiGatewayDeployer.deployGateway();
})();
