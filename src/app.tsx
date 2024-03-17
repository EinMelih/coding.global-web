import {
  ColorModeProvider,
  ColorModeScript,
  cookieStorageManagerSSR,
} from "@kobalte/core";
import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { ErrorBoundary, Suspense } from "solid-js";
import { isServer } from "solid-js/web";
import { getCookie } from "vinxi/server";
import "./app.css";
import { ModeToggle } from "./components/navbar/mode-toggle";

function getServerCookies() {
  "use server";
  const colorMode = getCookie("kb-color-mode");
  return colorMode ? `kb-color-mode=${colorMode}` : "";
}

export default function App() {
  const storageManager = cookieStorageManagerSSR(
    isServer ? getServerCookies() : document.cookie,
  );

  return (
    <>
      <Router
        root={(props) => (
          <MetaProvider>
            <Title>coding.global</Title>
            <ColorModeScript storageType={storageManager.type} />
            <ErrorBoundary
              fallback={(err) => {
                console.error(err);
                return err;
              }}
            >
              <ColorModeProvider storageManager={storageManager}>
                <div class="absolute right-0 top-0 z-[9999]">
                  <ModeToggle />
                </div>
                <Suspense>{props.children}</Suspense>
              </ColorModeProvider>
            </ErrorBoundary>
          </MetaProvider>
        )}
      >
        <FileRoutes />
      </Router>
    </>
  );
}