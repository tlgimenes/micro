import { useState } from "react";
import { Link, useRoute } from "wouter";

import Icon from "./Icon.tsx";
import Sidebar from "./Sidebar.tsx";

const links = [
  {
    name: "About",
    href: "/",
  },
  {
    name: "Quickstart",
    href: "/quickstart",
  },
  {
    name: "Docs",
    href: "/docs",
  },
];

const Logo = () => (
  <Link href="/" className="text-xl font-black leading-none text-gray-900">
    Micro.ts
  </Link>
);

const Links = ({ className }: { className?: string }) => (
  <ul className={className}>
    {links.map(({ name, href }) => {
      const [isActive] = useRoute(href);

      return (
        <li key={href}>
          <Link
            href={href}
            className={isActive ? "text-indigo-600 font-bold" : ""}
          >
            {name}
          </Link>
        </li>
      );
    })}
  </ul>
);

function Navbar() {
  const [displayMenu, setDisplayMenu] = useState(false);

  return (
    <nav className="h-16 border-b-2 border-gray-200 flex justify-between items-center px-2 sm:px-4">
      <div className="flex items-center gap-2">
        <button className="p-2 sm:hidden" onClick={() => setDisplayMenu(true)} aria-label="menu">
          <Icon name="menu" width={32} height={32}></Icon>
        </button>
        <Logo />
      </div>

      <Links className="hidden sm:flex sm:gap-4" />

      <button className="p-3" aria-label="search">
        <Icon name="search" width={24} height={24}></Icon>
      </button>

      <Sidebar display={displayMenu}>
        <>
          <header className="h-16 border-b-2 border-gray-200 flex items-center justify-between px-4">
            <Logo />
            <button className="p-2" onClick={() => setDisplayMenu(false)} aria-label="close">
              <Icon name="x" width={24} height={24}></Icon>
            </button>
          </header>

          <Links className="flex flex-col gap-4 pt-4 px-6" />
        </>
      </Sidebar>
    </nav>
  );
}

export default Navbar;
