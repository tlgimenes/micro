import React from "react";
import { Head } from "micro";
import App from "./app.server.tsx";
import Seo from "./pages/Seo.server.tsx";

import { Router } from "wouter";

function Html() {
  return (
    <Router>
      <html>
        <head>
          <Head />
          <Seo />
        </head>
        <body>
          <App />
        </body>
      </html>
    </Router>
  );
}

export default Html;
