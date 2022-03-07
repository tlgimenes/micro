import { Suspense } from "react";
import { Link } from "wouter";

interface Props {
  head: JSX.Element;
  main: JSX.Element;
}

function Shell({ head, main }: Props) {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <Suspense fallback={null}>
          {head}
        </Suspense>
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
          <Suspense fallback={<div>...loading</div>}>
            {main}
          </Suspense>
        </main>
        <footer>footer</footer>
      </body>
    </>
  );
}

export default Shell;
