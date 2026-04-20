import { XMLParser } from "https://esm.sh/fast-xml-parser@4.5.1";
import type { AtomEntry } from "./AtomEntry.ts";
import type { FeedEntry } from "./FeedEntry.ts";
import type { SqliteClient } from "./SqliteClient.ts";

export const FEED_URL = "https://oscarbarlow.com/feed.xml";
export const BUTTONDOWN_API_BASE = "https://api.buttondown.com/v1";
export const TABLE_NAME = "blog_email_sent_posts";

export async function initDatabase(db: SqliteClient) {
  await db.execute(`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id TEXT NOT NULL UNIQUE,
    post_title TEXT NOT NULL,
    post_url TEXT NOT NULL,
    sent_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
}

export function parseFeed(xml: string): FeedEntry[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });
  const parsed = parser.parse(xml);
  const rawEntries: AtomEntry[] = Array.isArray(parsed.feed?.entry)
    ? parsed.feed.entry
    : parsed.feed?.entry
    ? [parsed.feed.entry]
    : [];

  const results: FeedEntry[] = [];

  for (const entry of rawEntries) {
    const id = typeof entry.id === "string" ? entry.id : "";
    if (!id) continue;

    const title = typeof entry.title === "string"
      ? entry.title
      : typeof entry.title === "object"
      ? (entry.title?.["#text"] ?? "")
      : "";

    const links = Array.isArray(entry.link) ? entry.link : entry.link ? [entry.link] : [];
    const alternateLink = links.find((l) => l["@_rel"] === "alternate") ?? links[0];
    const url = alternateLink?.["@_href"] ?? "";

    const published = typeof entry.published === "string" ? entry.published : "";

    const content = typeof entry.content === "string"
      ? entry.content
      : typeof entry.content === "object"
      ? (entry.content?.["#text"] ?? "")
      : "";

    results.push({ id, title, url, published, content });
  }

  return results;
}

export async function filterNewEntries(
  entries: FeedEntry[],
  db: SqliteClient,
): Promise<FeedEntry[]> {
  if (entries.length === 0) return [];

  const placeholders = entries.map(() => "?").join(",");
  const result = await db.execute(
    `SELECT post_id FROM ${TABLE_NAME} WHERE post_id IN (${placeholders})`,
    entries.map((e) => e.id),
  );
  const sentIds = new Set(result.rows.map((r) => r[0]));
  return entries.filter((e) => !sentIds.has(e.id));
}

export async function createButtondownEmail(
  entry: FeedEntry,
  apiKey: string,
): Promise<void> {
  const body = [
    "<!-- buttondown-editor-mode: fancy -->",
    `<h1>${entry.title}</h1>`,
    `<p><a href="${entry.url}">Read on the web</a></p>`,
    "<hr>",
    entry.content,
  ].join("\n");

  const response = await fetch(`${BUTTONDOWN_API_BASE}/emails`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject: `${entry.title}`,
      body,
      status: "about_to_send",
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Buttondown API error (${response.status}): ${text}`,
    );
  }
}

export async function recordSentPost(
  entry: FeedEntry,
  db: SqliteClient,
): Promise<void> {
  await db.execute(
    `INSERT OR IGNORE INTO ${TABLE_NAME} (post_id, post_title, post_url) VALUES (?, ?, ?)`,
    [entry.id, entry.title, entry.url],
  );
}

export async function run(db: SqliteClient, apiKey: string): Promise<void> {
  await initDatabase(db);

  const response = await fetch(FEED_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch feed (${response.status})`);
  }
  const xml = await response.text();
  const entries = parseFeed(xml);
  const newEntries = await filterNewEntries(entries, db);

  if (newEntries.length === 0) {
    console.log("No new posts found.");
    return;
  }

  for (const entry of newEntries) {
    console.log(`Sending email for: ${entry.title}`);
    await createButtondownEmail(entry, apiKey);
    await recordSentPost(entry, db);
    console.log(`Recorded: ${entry.title}`);
  }

  console.log(`Processed ${newEntries.length} new post(s).`);
}
