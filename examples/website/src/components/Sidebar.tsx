import type { PropsWithChildren } from "react";

interface Props {
  display: boolean;
}

function Sidebar({ display, children }: PropsWithChildren<Props>) {
  return (
    <div className={display ? "block" : "hidden"}>
      <div className="absolute left-0 top-0 w-full h-full z-10 bg-white">
        {children}
      </div>
    </div>
  );
}

export default Sidebar;
