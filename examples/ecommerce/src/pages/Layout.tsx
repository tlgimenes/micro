import React, { PropsWithChildren } from "react";
import { Link } from "wouter";

function Layout({ children }: PropsWithChildren<unknown>) {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/pdp/p">Pdp</Link>
            </li>
            <li>
              <Link href="/s">Search</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>footer</footer>
    </>
  );
}

export default Layout;
