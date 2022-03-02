import React from "react";

const version = '0.0.1'

function Head() {
  return (
    <>
      <meta charSet="utf-8" />
      <meta http-equiv="x-ua-compatible" content="ie=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="generator" content={`Micro ${version}`} />
    </>
  );
}

export default Head;
