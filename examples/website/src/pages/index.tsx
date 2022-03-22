import { ComponentType, lazy } from "react";
import { Route, RouteComponentProps, Switch } from "wouter";

const importPage = (page: string) => ({
  head: lazy(() =>
    import(`./${page}/index.tsx`).then((x) => ({ default: x.Head }))
  ),
  main: lazy(() =>
    import(`./${page}/index.tsx`).then((x) => ({ default: x.Main }))
  ),
});

const Home = importPage("Home");
const Quickstart = importPage("Quickstart");
const Docs = importPage("Docs");
const NotFound = importPage("404");

interface Props {
  home: ComponentType<RouteComponentProps>;
  quickstart: ComponentType<RouteComponentProps>;
  docs: ComponentType<RouteComponentProps>;
  notFound: ComponentType<RouteComponentProps>;
}

function Router({ home, quickstart, docs, notFound }: Props) {
  return (
    <Switch>
      <Route path="/" component={home} />
      <Route path="/quickstart" component={quickstart} />
      <Route path="/docs" component={docs} />
      <Route component={notFound} />
    </Switch>
  );
}

export function Head() {
  return (
    <Router home={Home.head} quickstart={Quickstart.head} docs={Docs.head} notFound={NotFound.head} />
  );
}

export function Main() {
  return (
    <Router home={Home.main} quickstart={Quickstart.main} docs={Docs.main} notFound={NotFound.main} />
  );
}
