import React from "react";
import { Head } from "micro";

import Seo from "./pages/Seo.server.tsx";

import { Router } from "wouter";
import Layout from "./pages/Layout.tsx";
import Pages from "./pages/index.tsx";

function Html() {
  return (
    <Router>
      <html>
        <head>
          <Head />
          <Seo />
        </head>
        <body>
          <Layout>
            <Pages />
          </Layout>
        </body>
      </html>
    </Router>
  );
}

export default Html;
