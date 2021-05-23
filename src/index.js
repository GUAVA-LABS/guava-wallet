import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { HashRouter as Router } from "react-router-dom";
import { WalletProvider } from "./utils/context";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingLoop from "./assets/loading.mp4";
import styled from "styled-components";
const App = React.lazy(() => import("./components/App"));

export const LoadingBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
`;

ReactDOM.render(
  <ErrorBoundary>
    <Suspense
      fallback={
        <LoadingBody>
          <video loop>
            <source src={LoadingLoop} type="video/mp4" />
          </video>
        </LoadingBody>
      }
    >
      <WalletProvider>
        <Router>
          <App />
        </Router>
      </WalletProvider>
    </Suspense>
  </ErrorBoundary>,

  document.getElementById("root")
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () =>
    navigator.serviceWorker.register("/serviceWorker.js").catch(() => null)
  );
}

if (module.hot) {
  module.hot.accept();
}
