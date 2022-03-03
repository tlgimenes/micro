import React, { PropsWithChildren } from "react";
import { Head, Root } from "micro";
import Seo from "./pages/Seo.server.tsx";
import type { HtmlProps } from "micro";

import { Router } from "wouter";

import staticLocationHook from "wouter/static-location";
import Layout from "./pages/Layout.tsx";
import Pages from "./pages/index.tsx";

function Html({ importmap, url }: PropsWithChildren<HtmlProps>) {
  return (
    <Router hook={staticLocationHook(url.pathname)}>
      <html>
        <head>
          <Head />
          <Seo />
        </head>
        <body>
          <Root importmap={importmap}>
            <Layout>
              <Pages />
            </Layout>
          </Root>
        </body>
      </html>
    </Router>
  );
}

export default Html;
