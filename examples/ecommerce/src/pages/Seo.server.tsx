import React from "react";
import { Route, Switch } from "wouter";

import Home from "./Home/Seo.tsx";
import NotFound from "./404/Seo.tsx";
import Search from "./Search/Seo.tsx";
import Product from "./Product/Seo.tsx";
import Collection from "./Collection/Seo.tsx";

function Seo() {
  return (
    <Switch>
      <Route path="/" component={Home}></Route>
      <Route path="/s" component={Search}></Route>
      <Route path="/:slug/p" component={Product}></Route>
      <Route path="/:slug" component={Collection}></Route>
      <Route path="/*" component={NotFound}></Route>
    </Switch>
  );
}

export default Seo;
