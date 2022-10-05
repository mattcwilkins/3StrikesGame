import { RoleDeployer } from "../app-infrastructure/deployers/RoleDeployer";

(async () => {
  const roleDeployer = new RoleDeployer();

  await roleDeployer.deploy();
})();
