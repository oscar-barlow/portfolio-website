export const SAMPLE_ATOM_FEED = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title type="html">Oscar Barlow</title>
  <subtitle>Writings</subtitle>
  <link href="https://www.oscarbarlow.com/feed.xml" rel="self" type="application/atom+xml" />
  <link href="https://www.oscarbarlow.com/" rel="alternate" type="text/html" />
  <updated>2026-04-14T00:00:00+00:00</updated>
  <id>https://www.oscarbarlow.com/feed.xml</id>

  <entry>
    <title type="html">Zones of want</title>
    <link href="https://www.oscarbarlow.com/2026/04/14/zones-of-want/" rel="alternate" type="text/html" title="Zones of want" />
    <published>2026-04-14T00:00:00+00:00</published>
    <updated>2026-04-14T00:00:00+00:00</updated>
    <id>repo://posts.collection/_posts/2026-04-14-zones-of-want.md</id>
    <content type="html" xml:base="https://www.oscarbarlow.com/2026/04/14/zones-of-want/">&lt;p&gt;Some thoughts about wanting things.&lt;/p&gt;&lt;hr&gt;&lt;p&gt;More content here.&lt;/p&gt;</content>
    <author><name></name></author>
  </entry>

  <entry>
    <title type="html">Three buckets of AI work</title>
    <link href="https://www.oscarbarlow.com/2026/03/03/three-buckets-ai-work/" rel="alternate" type="text/html" title="Three buckets of AI work" />
    <published>2026-03-03T00:00:00+00:00</published>
    <updated>2026-03-03T00:00:00+00:00</updated>
    <id>repo://posts.collection/_posts/2026-03-03-three-buckets-ai-work.md</id>
    <content type="html" xml:base="https://www.oscarbarlow.com/2026/03/03/three-buckets-ai-work/">&lt;p&gt;Henry Ford had some ideas.&lt;/p&gt;&lt;blockquote&gt;A quote&lt;/blockquote&gt;</content>
    <author><name></name></author>
  </entry>

  <entry>
    <title type="html">A post with no content</title>
    <link href="https://www.oscarbarlow.com/2026/01/01/no-content/" rel="alternate" type="text/html" />
    <published>2026-01-01T00:00:00+00:00</published>
    <updated>2026-01-01T00:00:00+00:00</updated>
    <id>repo://posts.collection/_posts/2026-01-01-no-content.md</id>
    <content type="html"></content>
    <author><name></name></author>
  </entry>
</feed>`;

export const FEED_WITH_MISSING_ID = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Test</title>
  <entry>
    <title type="html">Has an ID</title>
    <link href="https://example.com/post-1" rel="alternate" type="text/html" />
    <published>2026-01-01T00:00:00+00:00</published>
    <id>post-1</id>
    <content type="html">&lt;p&gt;Content&lt;/p&gt;</content>
  </entry>
  <entry>
    <title type="html">No ID entry</title>
    <link href="https://example.com/post-2" rel="alternate" type="text/html" />
    <published>2026-01-02T00:00:00+00:00</published>
    <content type="html">&lt;p&gt;Content&lt;/p&gt;</content>
  </entry>
</feed>`;

export interface MockSqliteCall {
  query: string;
  params?: unknown[];
}

export function createMockSqlite() {
  const calls: MockSqliteCall[] = [];
  const storedIds = new Set<string>();

  return {
    calls,
    storedIds,
    async execute(query: string, params?: unknown[]) {
      calls.push({ query, params });

      if (query.includes("CREATE TABLE")) {
        return { rows: [] };
      }

      if (query.includes("SELECT post_id")) {
        const ids = (params ?? []) as string[];
        const found = ids.filter((id) => storedIds.has(id));
        return { rows: found.map((id) => [id]) };
      }

      if (query.includes("INSERT")) {
        const postId = params?.[0] as string;
        if (postId) storedIds.add(postId);
        return { rows: [] };
      }

      return { rows: [] };
    },
  };
}

export interface CapturedRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
}

export function createMockFetch(
  feedXml: string,
  buttondownResponse: { ok: boolean; status: number; body: string } = {
    ok: true,
    status: 201,
    body: JSON.stringify({ id: "mock-email-id" }),
  },
) {
  const capturedRequests: CapturedRequest[] = [];
  const originalFetch = globalThis.fetch;

  const mockFetch = async (
    input: string | URL | Request,
    init?: RequestInit,
  ): Promise<Response> => {
    const url = typeof input === "string"
      ? input
      : input instanceof URL
      ? input.toString()
      : input.url;

    if (url.includes("oscarbarlow.com/feed.xml")) {
      return new Response(feedXml, {
        status: 200,
        headers: { "Content-Type": "application/xml" },
      });
    }

    if (url.includes("api.buttondown.com")) {
      const body = init?.body ? JSON.parse(init.body as string) : null;
      const headers: Record<string, string> = {};
      if (init?.headers) {
        const h = new Headers(init.headers);
        h.forEach((v, k) => {
          headers[k] = v;
        });
      }
      capturedRequests.push({
        url,
        method: init?.method ?? "GET",
        headers,
        body,
      });
      return new Response(buttondownResponse.body, {
        status: buttondownResponse.status,
        ok: buttondownResponse.ok,
      } as ResponseInit);
    }

    return originalFetch(input, init);
  };

  return {
    capturedRequests,
    install() {
      globalThis.fetch = mockFetch as typeof globalThis.fetch;
    },
    restore() {
      globalThis.fetch = originalFetch;
    },
  };
}
