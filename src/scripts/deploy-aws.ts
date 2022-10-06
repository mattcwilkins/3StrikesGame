import { Orchestrator } from "../app-infrastructure/orchestration/Orchestrator";

/**
 * Deploys the AWS stack.
 */
(async () => {
  await new Orchestrator().deploy();
})();
