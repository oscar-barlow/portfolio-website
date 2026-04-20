import { assertEquals, assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  createButtondownEmail,
  filterNewEntries,
  parseFeed,
  recordSentPost,
  run,
} from "./lib.ts";
import type { FeedEntry } from "./FeedEntry.ts";
import {
  createMockFetch,
  createMockSqlite,
  FEED_WITH_MISSING_ID,
  SAMPLE_ATOM_FEED,
} from "./testFixtures.ts";

Deno.test("parseFeed — parses valid Atom XML", () => {
  const entries = parseFeed(SAMPLE_ATOM_FEED);

  assertEquals(entries.length, 3);

  assertEquals(entries[0].id, "repo://posts.collection/_posts/2026-04-14-zones-of-want.md");
  assertEquals(entries[0].title, "Zones of want");
  assertEquals(entries[0].url, "https://www.oscarbarlow.com/2026/04/14/zones-of-want/");
  assertEquals(entries[0].published, "2026-04-14T00:00:00+00:00");

  assertEquals(entries[1].id, "repo://posts.collection/_posts/2026-03-03-three-buckets-ai-work.md");
  assertEquals(entries[1].title, "Three buckets of AI work");
});

Deno.test("parseFeed — skips entries without an id", () => {
  const entries = parseFeed(FEED_WITH_MISSING_ID);

  assertEquals(entries.length, 1);
  assertEquals(entries[0].id, "post-1");
  assertEquals(entries[0].title, "Has an ID");
});

Deno.test("filterNewEntries — all new when DB is empty", async () => {
  const db = createMockSqlite();
  const entries: FeedEntry[] = [
    { id: "post-1", title: "Post 1", url: "https://example.com/1", published: "2026-01-01", content: "<p>Hi</p>" },
    { id: "post-2", title: "Post 2", url: "https://example.com/2", published: "2026-01-02", content: "<p>Hi</p>" },
  ];

  const result = await filterNewEntries(entries, db);
  assertEquals(result.length, 2);
});

Deno.test("filterNewEntries — filters out already-sent entries", async () => {
  const db = createMockSqlite();
  db.storedIds.add("post-1");

  const entries: FeedEntry[] = [
    { id: "post-1", title: "Post 1", url: "https://example.com/1", published: "2026-01-01", content: "" },
    { id: "post-2", title: "Post 2", url: "https://example.com/2", published: "2026-01-02", content: "" },
  ];

  const result = await filterNewEntries(entries, db);
  assertEquals(result.length, 1);
  assertEquals(result[0].id, "post-2");
});

Deno.test("filterNewEntries — returns empty when all already sent", async () => {
  const db = createMockSqlite();
  db.storedIds.add("post-1");
  db.storedIds.add("post-2");

  const entries: FeedEntry[] = [
    { id: "post-1", title: "Post 1", url: "https://example.com/1", published: "2026-01-01", content: "" },
    { id: "post-2", title: "Post 2", url: "https://example.com/2", published: "2026-01-02", content: "" },
  ];

  const result = await filterNewEntries(entries, db);
  assertEquals(result.length, 0);
});

Deno.test("createButtondownEmail — sends correct request", async () => {
  const mock = createMockFetch("");
  mock.install();

  try {
    const entry: FeedEntry = {
      id: "post-1",
      title: "Test Post",
      url: "https://example.com/test",
      published: "2026-01-01",
      content: "<p>Hello world</p>",
    };

    await createButtondownEmail(entry, "test-api-key");

    assertEquals(mock.capturedRequests.length, 1);
    const req = mock.capturedRequests[0];
    assertEquals(req.method, "POST");
    assertEquals(req.url, "https://api.buttondown.com/v1/emails");
    assertEquals(req.headers["authorization"], "Token test-api-key");
    assertEquals(req.headers["content-type"], "application/json");

    const body = req.body as { subject: string; body: string; status: string };
    assertEquals(body.subject, "Test Post");
    assertEquals(body.status, "about_to_send");
    assertEquals(body.body.includes("<p>Hello world</p>"), true);
    assertEquals(body.body.includes("Read on the web"), true);
    assertEquals(body.body.includes("buttondown-editor-mode: fancy"), true);
  } finally {
    mock.restore();
  }
});

Deno.test("createButtondownEmail — throws on API error", async () => {
  const mock = createMockFetch("", {
    ok: false,
    status: 400,
    body: '{"detail": "Invalid request"}',
  });
  mock.install();

  try {
    const entry: FeedEntry = {
      id: "post-1",
      title: "Test",
      url: "https://example.com",
      published: "2026-01-01",
      content: "",
    };

    await assertRejects(
      () => createButtondownEmail(entry, "test-api-key"),
      Error,
      "Buttondown API error (400)",
    );
  } finally {
    mock.restore();
  }
});

Deno.test("recordSentPost — inserts into database", async () => {
  const db = createMockSqlite();
  const entry: FeedEntry = {
    id: "post-1",
    title: "Test Post",
    url: "https://example.com/test",
    published: "2026-01-01",
    content: "",
  };

  await recordSentPost(entry, db);

  assertEquals(db.storedIds.has("post-1"), true);
  const insertCall = db.calls.find((c) => c.query.includes("INSERT"));
  assertEquals(insertCall?.params, ["post-1", "Test Post", "https://example.com/test"]);
});

Deno.test("run — end-to-end: detects new posts, creates emails, records them", async () => {
  const db = createMockSqlite();
  const mock = createMockFetch(SAMPLE_ATOM_FEED);
  mock.install();

  try {
    await run(db, "test-key");

    assertEquals(mock.capturedRequests.length, 3);
    assertEquals(db.storedIds.size, 3);

    // Verify Buttondown was called with correct data for first post
    const firstReq = mock.capturedRequests[0];
    const body = firstReq.body as { subject: string; status: string };
    assertEquals(body.subject, "Zones of want");
    assertEquals(body.status, "about_to_send");
  } finally {
    mock.restore();
  }
});

Deno.test("run — idempotency: second run creates zero emails", async () => {
  const db = createMockSqlite();
  const mock = createMockFetch(SAMPLE_ATOM_FEED);
  mock.install();

  try {
    // First run
    await run(db, "test-key");
    assertEquals(mock.capturedRequests.length, 3);

    // Second run — same feed, same DB
    mock.capturedRequests.length = 0;
    await run(db, "test-key");

    assertEquals(mock.capturedRequests.length, 0);
  } finally {
    mock.restore();
  }
});
