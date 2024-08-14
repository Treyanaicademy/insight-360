import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);