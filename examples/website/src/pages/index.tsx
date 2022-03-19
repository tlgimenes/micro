import { ComponentType, lazy } from "react";
import { Route, RouteComponentProps, Switch } from "wouter";

const importPage = (page: string) => ({
  head: lazy(() => import(`./${page}/index.tsx`).then(x => ({ default: x.Head}))),
  main: lazy(() => import(`./${page}/index.tsx`).then(x => ({ default: x.Main})))
})

const Home = importPage('Home')
const Product = importPage('Product')
const NotFound = importPage('404')

interface Props {
  home: ComponentType<RouteComponentProps>;
  product: ComponentType<RouteComponentProps>;
  notFound: ComponentType<RouteComponentProps>;
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
  return <Router home={Home.head} product={Product.head} notFound={NotFound.head} />
}

export function Main() {
  return <Router home={Home.main} product={Product.main} notFound={NotFound.main} />;
}

