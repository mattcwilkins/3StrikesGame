#!/usr/bin/env node

/**
 * Create the lambda node modules
 */
(async () => {
  const fs = require("fs-extra");
  const path = require("path");

  const root = path.join(__dirname, "..", "..");

  const pkg = path.join(root, "package.json");
  const workspace = path.join(root, "workspace");

  for (const location of [pkg]) {
    await fs.copy(location, path.join(workspace, path.basename(location)));
  }
})();
