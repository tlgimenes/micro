import { ComponentType } from "react";
import { Route, RouteComponentProps, Switch } from "wouter";

import * as Home from "./Home/index.server.tsx";
import * as Product from "./Product/index.server.tsx";
import * as NotFound from "./404/index.server.tsx";

interface Props {
  home: ComponentType<RouteComponentProps<any>>;
  product: ComponentType<RouteComponentProps<any>>;
  notFound: ComponentType<RouteComponentProps<any>>;
}

function Router({ home, product, notFound }: Props) {
  return (
    <Switch>
      <Route path="/" component={home} />
      <Route path="/:slug/p" component={product} />
      <Route component={notFound} />
    </Switch>
  );
}

export function Head() {
  return <Router home={Home.Head} product={Product.Head} notFound={NotFound.Head} />
}

export function Main() {
  return <Router home={Home.Main} product={Product.Main} notFound={NotFound.Main} />;
}
