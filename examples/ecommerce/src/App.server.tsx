import React, { PropsWithChildren } from "react";
import { Router } from "wouter";
import staticLocationHook from "wouter/static-location";

import { Head, Script } from "../../../packages/micro/mod.ts";
import Pages from "./pages/index.tsx";
import Layout from "./pages/Layout.tsx";
import Seo from "./pages/Seo.server.tsx";

import type { HtmlProps } from "../../../packages/micro/mod.ts";

function Html({ importmap, url }: PropsWithChildren<HtmlProps>) {
  return (
    <Router hook={staticLocationHook(url.pathname)}>
      <html>
        <head>
          <Head />
          <Seo />
        </head>
        <body>
          <Layout>
            <Pages />
          </Layout>
          <Script importmap={importmap} />
        </body>
      </html>
    </Router>
  );
}

export default Html;
