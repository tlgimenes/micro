import { Suspense } from "react";
import { Link } from "wouter";
import Footer from "./components/Footer.tsx";
import Navbar from "./components/Navbar.tsx";

import { Head, Main } from "./pages/index.tsx";

function Shell() {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link rel="stylesheet" type="text/css" href="/styles.css" />
        <Suspense fallback={null}>
          <Head />
        </Suspense>
      </head>
      <body>
        <header>
          <Navbar />
        </header>
        <main className="min-h-screen">
          <Suspense fallback={<div>...loading</div>}>
            <Main />
          </Suspense>
        </main>
        <Footer />
      </body>
    </>
  );
}

export default Shell;
