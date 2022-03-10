import { cac } from "./deps.ts";
import { dev } from "./src/commands/dev.ts";
import { serve } from "./src/commands/serve.ts";

const cli = cac("micro");

cli
  .command("serve", "Start a production server")
  .option("-r, --root <dir>", "Project root: Default Deno.cwd()", {
    default: Deno.cwd(),
  })
  .option("-h, --host <host>", "Project root: Default Deno.cwd()", {
    default: "http://localhost:3000",
  })
  .action((options: { root: string; host: string }) => serve(options));

cli
  .command("dev", "Start a development server")
  .option("-r, --root <dir>", "Project root: Default Deno.cwd()", {
    default: Deno.cwd(),
  })
  .option("-h, --host <host>", "Project root: Default Deno.cwd()", {
    default: "http://localhost:3000",
  })
  .action((options: { root: string; host: string }) => dev(options));

cli.parse();
