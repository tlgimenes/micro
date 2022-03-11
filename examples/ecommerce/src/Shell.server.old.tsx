import { Link } from "wouter";

import * as Pages from "./pages/index.server.tsx";

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
        <Pages.Head />
      </head>
      <body>
        <header>
          <nav>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/ergonomic-soft-hat-65465029/p">Pdp</Link>
              </li>
              <li>
                <Link href="/asd">NotFound</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <Pages.Main />
        </main>
        <footer>footer</footer>
      </body>
    </>
  );
}

export default Shell;
