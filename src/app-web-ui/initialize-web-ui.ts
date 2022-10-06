import { Root } from "./components/Root";
import React from "react";
import { createRoot } from "react-dom/client";

const container = document.createElement("div");
container.setAttribute("id", "3-strikes-game-web-ui-root");

document.body.appendChild(container);

const root = createRoot(container);
root.render(React.createElement(Root, {}));
