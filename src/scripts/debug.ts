#!/usr/bin/env node

import { inject } from "../services/internal/dependency-injection/inject";
import { SelectionService } from "../services/internal/SelectionService";
import { Authorization } from "../services/internal/authorization/Authorization";

(async () => {
  await inject(SelectionService).makeSelection("kuhe2", "lorrielorrie", {
    firstBaseFielder: "660271",
    secondBaseFielder: "595453",
    shortStop: "435559",
    thirdBaseFielder: "645444",
    outfield: "677950",
    defensiveTeam: "119",
    forTimestamp: 1661212800000,
  } as any);

  return inject(SelectionService).listSelectionsForUser("kuhe2");
  // console.log(makeSelection);
})()
  .then(console.log)
  .catch(console.error);
