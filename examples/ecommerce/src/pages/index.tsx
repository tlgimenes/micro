import React, { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";

const Home = lazy(() => import("./Home/Template.tsx"));
const NotFound = lazy(() => import("./404/Template.tsx"));
const Search = lazy(() => import("./Search/Template.tsx"));
const Product = lazy(() => import("./Product/Template.tsx"));
const Collection = lazy(() => import("./Collection/Template.tsx"));

function Pages() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Switch>
        <Route path="/" component={Home}></Route>
        <Route path="/s" component={Search}></Route>
        <Route path="/:slug/p" component={Product}></Route>
        <Route path="/:slug" component={Collection}></Route>
        <Route path="/*" component={NotFound}></Route>
      </Switch>
    </Suspense>
  );
}

export default Pages;
