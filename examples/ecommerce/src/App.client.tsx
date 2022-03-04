import React from "react";
import { Router } from "wouter";

import Head from "./Head.tsx";
import Pages from "./pages/index.tsx";
import Layout from "./pages/Layout.tsx";
import Seo from "./pages/Seo.server.tsx";

function Html() {
  return (
    <Router>
      <>
        <head>
          <Head />
          <Seo />
        </head>
        <body>
          <Layout>
            <Pages />
          </Layout>
        </body>
      </>
    </Router>
  );
}

export default Html;
