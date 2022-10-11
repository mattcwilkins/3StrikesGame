#!/usr/bin/env node

import { Orchestrator } from "../app-infrastructure/orchestration/Orchestrator";

/**
 * Deploys the front end only.
 */
(async () => {
  await new Orchestrator().deployWebUiOnly();
})();
