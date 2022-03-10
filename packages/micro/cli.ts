import { cac } from "./deps.ts";
import { serve } from "./src/server.ts";

const cli = cac("micro");

cli
  .command("start", "Start a production server")
  .option("-r, --root <dir>", "Project root: Default Deno.cwd()", {
    default: Deno.cwd(),
  })
  .option("-h, --host <host>", "Project root: Default Deno.cwd()", {
    default: "http://localhost:3000",
  })
  .action((options: { root: string; host: string }) => serve(options));

cli.parse();
