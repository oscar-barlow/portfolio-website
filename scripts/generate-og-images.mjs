// Pull-quote / OG image generator for oscarbarlow.com
//
// Scans src/_posts/*.md for a `pull_quote` frontmatter field and renders a
// branded PNG per matching post: a 1080x1080 square (for manual upload to
// LinkedIn) and a 1200x630 landscape (wired as the post's og:image).
//
// Rendering is pure Node — Satori turns a small flexbox VDOM into SVG, and
// @resvg/resvg-js rasterises that to PNG. No headless browser.
//
// Run standalone with:  node scripts/generate-og-images.mjs
// The Makefile runs it after `bridgetown build` so images land in output/.

import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import matter from 'gray-matter';
// satori and @resvg/resvg-js are imported lazily inside renderPng() so that
// importing this module's pure helpers (e.g. from Vitest) does not trigger
// Satori's async layout-engine (yoga-wasm) initialisation.

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

// --- Brand tokens (mirrors frontend/styles/index.css :root + favicon.svg) ---
const TEAL = '#2F5F5F'; // --tertiary-color
const BURGUNDY = '#722F37'; // --action-color
const HEADING = '#1a1a1a'; // --heading-color
const MUTED = '#5a5a5a'; // --muted-text
const CARD_BG = '#f6f4f0'; // off-white card, kin to --body-background #fefcf9

// Favicon / brand-mark gradient: teal (top-left) -> burgundy (bottom-right).
const BG_GRADIENT = `linear-gradient(135deg, ${TEAL} 0%, ${BURGUNDY} 100%)`;

// Call to action shown on every image — drives traffic back to the site when
// the image is shared on its own (e.g. LinkedIn, where the image is not itself
// clickable, so this is a prompt rather than a live link). Points at the
// writing index, which is stable across posts.
// Note: the ASCII "->" is rendered as a proper arrow by Inter's ligature; the
// U+2192 arrow glyph is not in the fontsource Latin subset (would be tofu), and
// "->" degrades gracefully to readable text if ligatures are ever disabled.
const CTA_TEXT = 'Read the full post on oscarbarlow.com/writing ->';

export const FORMATS = {
  square: { width: 1080, height: 1080 }, // primary LinkedIn asset
  og: { width: 1200, height: 630 }, // og:image / link preview
};

// Fontsource ships Inter as .woff (Satori reads ttf/otf/woff, not woff2).
const FONT_DIR = join(REPO_ROOT, 'node_modules', '@fontsource', 'inter', 'files');
const FONT_FILES = {
  regular: 'inter-latin-400-normal.woff',
  bold: 'inter-latin-700-normal.woff',
  italic: 'inter-latin-400-italic.woff',
};

/**
 * Load the three Inter faces Satori needs. Cached across calls.
 */
let _fonts = null;
export function loadFonts() {
  if (_fonts) return _fonts;
  const read = (f) => readFileSync(join(FONT_DIR, f));
  _fonts = [
    { name: 'Inter', data: read(FONT_FILES.regular), weight: 400, style: 'normal' },
    { name: 'Inter', data: read(FONT_FILES.bold), weight: 700, style: 'normal' },
    { name: 'Inter', data: read(FONT_FILES.italic), weight: 400, style: 'italic' },
  ];
  return _fonts;
}

const DATE_PREFIX = /^\d{4}-\d{2}-\d{2}-(.+)$/;

/**
 * Resolve a post's slug the way Bridgetown does: an explicit `slug:` frontmatter
 * key wins, otherwise it's the filename with the `YYYY-MM-DD-` prefix and the
 * `.md` extension stripped. This matches `resource.data.slug`, which the Liquid
 * layer uses to point og:image at the generated file.
 */
/**
 * Normalise a post's `date` frontmatter to a `YYYY-MM-DD` string. gray-matter
 * (via js-yaml) parses an unquoted `date: 2026-03-03` into a JS Date, and a
 * quoted one into a string — handle both. This mirrors the date Bridgetown puts
 * in the URL and in `resource.data.date`, so the image filename lines up with
 * the path the Liquid layer builds.
 */
export function formatPostDate(value) {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString().slice(0, 10);
  }
  const m = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
  if (!m) throw new Error(`Unrecognised post date: ${JSON.stringify(value)}`);
  return m[1];
}

/**
 * The image filename stem: `YYYY-MM-DD-{slug}`. Date-namespacing avoids clashes
 * between posts that share a slug and keeps files sortable/memorable.
 */
export function imageBaseName(date, slug) {
  return `${formatPostDate(date)}-${slug}`;
}

export function slugForPost(filename, data = {}) {
  if (data && typeof data.slug === 'string' && data.slug.trim()) {
    return data.slug.trim();
  }
  const base = filename.replace(/\.(md|markdown)$/i, '');
  const m = base.match(DATE_PREFIX);
  return m ? m[1] : base;
}

/**
 * Typographic cleanup: curly apostrophes, curly double quotes, and wrap the
 * whole quote in matched curly double quotes. Any straight/curly quotes already
 * surrounding the text are stripped first so we never double up.
 */
export function smartQuotes(text) {
  let t = String(text).trim();
  t = t.replace(/^[“”"'`]+/, '').replace(/[“”"'`]+$/, '').trim();
  // Apostrophes inside words: don't -> don’t
  t = t.replace(/([A-Za-z0-9])'([A-Za-z0-9])/g, '$1’$2');
  // Any remaining straight single quotes -> right single quote
  t = t.replace(/'/g, '’');
  // Straight double quotes alternate opening/closing
  let i = 0;
  t = t.replace(/"/g, () => (i++ % 2 === 0 ? '“' : '”'));
  return `“${t}”`;
}

/**
 * Choose a quote font size (px) from the character count so quotes up to ~200
 * chars fit without overflow. The landscape format has far less vertical room
 * than the square, so it gets a smaller scale.
 */
export function quoteFontSize(length, format = 'square') {
  const squareBuckets = [
    [70, 68],
    [110, 60],
    [150, 52],
    [200, 44],
    [Infinity, 38],
  ];
  const ogBuckets = [
    [70, 52],
    [110, 46],
    [150, 40],
    [200, 34],
    [Infinity, 30],
  ];
  const buckets = format === 'og' ? ogBuckets : squareBuckets;
  for (const [max, size] of buckets) {
    if (length <= max) return size;
  }
  return buckets[buckets.length - 1][1];
}

/**
 * Build the Satori VDOM for one image. Returns { node, width, height }.
 */
export function buildTemplate({ quote, attribution, format = 'square' }) {
  const { width, height } = FORMATS[format] || FORMATS.square;
  const isOg = format === 'og';

  const quoted = smartQuotes(quote);
  const fontSize = quoteFontSize(quote.length, format);

  const pad = isOg ? 56 : 96; // outer canvas padding
  const cardPadX = isOg ? 72 : 88;
  const cardPadY = isOg ? 56 : 96;

  const children = [
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          textAlign: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter',
          fontWeight: 700,
          fontSize,
          lineHeight: 1.28,
          letterSpacing: '-0.01em',
          color: HEADING,
        },
        children: quoted,
      },
    },
  ];

  if (attribution && String(attribution).trim()) {
    children.push({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          justifyContent: 'center',
          marginTop: isOg ? 26 : 44,
          fontFamily: 'Inter',
          fontWeight: 400,
          fontStyle: 'italic',
          fontSize: isOg ? 26 : 34,
          color: MUTED,
        },
        children: `— ${String(attribution).trim()}`,
      },
    });
  }

  // Call to action — drives traffic back to the site when the image is shared.
  children.push({
    type: 'div',
    props: {
      style: {
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: isOg ? 26 : 48,
        fontFamily: 'Inter',
        fontWeight: 500,
        fontSize: isOg ? 20 : 24,
        letterSpacing: '0.01em',
        color: MUTED,
      },
      children: CTA_TEXT,
    },
  });

  const card = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '100%',
        padding: `${cardPadY}px ${cardPadX}px`,
        borderRadius: 28,
        backgroundColor: CARD_BG,
        boxShadow: '0 24px 70px rgba(0,0,0,0.28)',
      },
      children,
    },
  };

  const node = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: pad,
        backgroundImage: BG_GRADIENT,
      },
      children: card,
    },
  };

  return { node, width, height };
}

/**
 * Render one image to a PNG Buffer.
 */
export async function renderPng({ quote, attribution, format = 'square' }, fonts = loadFonts()) {
  const { default: satori } = await import('satori');
  const { Resvg } = await import('@resvg/resvg-js');
  const { node, width, height } = buildTemplate({ quote, attribution, format });
  const svg = await satori(node, { width, height, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width } });
  return resvg.render().asPng();
}

/**
 * Read every post in `dir`, returning those with a non-empty pull_quote. Each
 * result carries a `base` (`YYYY-MM-DD-{slug}`) used for the image filenames.
 * Throws if two posts resolve to the same `base` — possible when a post's
 * frontmatter date differs from its filename date — so a collision fails the
 * build loudly instead of silently overwriting.
 */
export function parsePosts(dir) {
  const files = readdirSync(dir).filter((f) => /\.(md|markdown)$/i.test(f));
  const posts = [];
  const seen = new Map();
  for (const file of files.sort()) {
    const raw = readFileSync(join(dir, file), 'utf8');
    const { data } = matter(raw);
    const quote = data && data.pull_quote;
    if (!quote || !String(quote).trim()) continue;
    if (!data.date) {
      throw new Error(`Post ${file} has a pull_quote but no date; a date is required for the image filename.`);
    }
    const slug = slugForPost(file, data);
    const base = imageBaseName(data.date, slug);
    if (seen.has(base)) {
      throw new Error(
        `Duplicate pull-quote image name "${base}" from ${file} and ${seen.get(base)}. ` +
          `Give one a distinct \`slug:\` frontmatter key.`
      );
    }
    seen.set(base, file);
    posts.push({
      slug,
      base,
      quote: String(quote).trim(),
      attribution: data.pull_quote_attribution ? String(data.pull_quote_attribution).trim() : '',
      sourceFile: file,
    });
  }
  return posts;
}

async function main() {
  const postsDir = process.env.OG_POSTS_DIR || join(REPO_ROOT, 'src', '_posts');
  const outDir = process.env.OG_OUT_DIR || join(REPO_ROOT, 'output', 'images', 'pull-quotes');

  const posts = parsePosts(postsDir);
  if (posts.length === 0) {
    console.log('[og-images] No posts with a pull_quote — nothing to generate.');
    return;
  }

  mkdirSync(outDir, { recursive: true });
  const fonts = loadFonts();

  for (const post of posts) {
    const square = await renderPng({ quote: post.quote, attribution: post.attribution, format: 'square' }, fonts);
    const og = await renderPng({ quote: post.quote, attribution: post.attribution, format: 'og' }, fonts);
    writeFileSync(join(outDir, `${post.base}.png`), square);
    writeFileSync(join(outDir, `${post.base}-og.png`), og);
    console.log(`[og-images] ${post.slug}: wrote ${post.base}.png (1080x1080) + ${post.base}-og.png (1200x630)`);
  }
  console.log(`[og-images] Done — ${posts.length} post(s) into ${outDir}`);
}

// Only run generation when invoked directly, so tests can import helpers.
if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main().catch((err) => {
    console.error('[og-images] Failed:', err);
    process.exit(1);
  });
}
