import React from "react";
import { Router } from "wouter";
import Pages from "./pages/index.tsx";
import Layout from "./pages/Layout.tsx";

function App() {
  return (
    <Router>
      <Layout>
        <Pages />
      </Layout>
    </Router>
  );
}

export default App;
