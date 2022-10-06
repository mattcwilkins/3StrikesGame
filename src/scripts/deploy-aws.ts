import { Orchestrator } from "../app-infrastructure/orchestration/Orchestrator";

(async () => {
  await new Orchestrator().deploy();
})();
