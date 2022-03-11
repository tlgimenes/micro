import * as Home from './pages/Home/index.server.tsx'

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
        <Home.Head />
      </head>
      <body>
        <header>
          <nav>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/ergonomic-soft-hat-65465029/p">Pdp</a>
              </li>
              <li>
                <a href="/asd">NotFound</a>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <Home.Main />
        </main>
        <footer>footer</footer>
      </body>
    </>
  );
}

export default Shell;
