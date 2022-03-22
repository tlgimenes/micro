import { Link, useRoute } from "wouter";
import Icon from "./Icon.tsx";

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

function Navbar() {
  return (
    <nav className="h-16 border-b-2 border-gray-200 flex justify-between items-center px-2 sm:px-4">
      <div className="flex items-center gap-2">
        <button className="p-2 sm:hidden">
          <Icon name="menu" width={32} height={32}></Icon>
        </button>
        <Link
          href="/"
          className="text-xl font-black leading-none text-gray-900"
        >
          Micro.ts
        </Link>
      </div>

      <ul className="hidden sm:flex sm:gap-4">
        {links.map(({ name, href }) => {
          const [isActive] = useRoute(href);

          return (
            <li>
              <Link
                href={href}
                className={isActive ? "text-indigo-500 font-bold" : ""}
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>

      <button className="p-3">
        <Icon name="search" width={24} height={24}></Icon>
      </button>
    </nav>
  );
}

export default Navbar;
