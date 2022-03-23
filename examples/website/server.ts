import { serve } from "../../packages/micro/server.ts";

// Support deploy on heroku
const port = Deno.env.get("PORT") ?? "3000";

await serve({
  host: `http://localhost:${port}`,
});
