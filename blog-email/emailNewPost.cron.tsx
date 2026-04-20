import { sqlite } from "https://esm.town/v/stevekrouse/sqlite";
import { run } from "./lib.ts";

export default async function () {
  const apiKey = Deno.env.get("BUTTONDOWN_API_KEY");
  if (!apiKey) {
    throw new Error("BUTTONDOWN_API_KEY environment variable is not set");
  }
  await run(sqlite, apiKey);
}
