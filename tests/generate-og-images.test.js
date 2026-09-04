import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  slugForPost,
  formatPostDate,
  imageBaseName,
  smartQuotes,
  quoteFontSize,
  parsePosts,
  FORMATS,
} from '../scripts/generate-og-images.mjs';

describe('slugForPost', () => {
  it('strips the YYYY-MM-DD- date prefix and extension', () => {
    expect(slugForPost('2026-04-14-zones-of-want.md')).toBe('zones-of-want');
  });

  it('handles .markdown extension', () => {
    expect(slugForPost('2019-08-14-tech-debt.markdown')).toBe('tech-debt');
  });

  it('honours an explicit slug frontmatter key over the filename', () => {
    expect(slugForPost('2026-01-01-original.md', { slug: 'custom-slug' })).toBe('custom-slug');
  });

  it('ignores a blank slug key and falls back to the filename', () => {
    expect(slugForPost('2026-01-01-original.md', { slug: '   ' })).toBe('original');
  });

  it('falls back to basename when there is no date prefix', () => {
    expect(slugForPost('about.md')).toBe('about');
  });
});

describe('formatPostDate', () => {
  it('formats a Date (as gray-matter yields for an unquoted date) to YYYY-MM-DD', () => {
    expect(formatPostDate(new Date('2026-03-03T00:00:00Z'))).toBe('2026-03-03');
  });

  it('accepts a plain YYYY-MM-DD string', () => {
    expect(formatPostDate('2026-03-03')).toBe('2026-03-03');
  });

  it('takes the date portion of a longer datetime string', () => {
    expect(formatPostDate('2026-03-03 09:00:00')).toBe('2026-03-03');
  });

  it('throws on an unrecognisable date', () => {
    expect(() => formatPostDate('not-a-date')).toThrow(/unrecognised post date/i);
  });
});

describe('imageBaseName', () => {
  it('joins date and slug as YYYY-MM-DD-{slug}', () => {
    expect(imageBaseName('2026-03-03', 'three-buckets-ai-work')).toBe('2026-03-03-three-buckets-ai-work');
  });
});

describe('smartQuotes', () => {
  it('wraps the quote in curly double quotes', () => {
    expect(smartQuotes('hello world')).toBe('“hello world”');
  });

  it('does not double up when the text is already quoted', () => {
    expect(smartQuotes('"hello"')).toBe('“hello”');
    expect(smartQuotes('“hello”')).toBe('“hello”');
  });

  it('converts in-word apostrophes to curly', () => {
    expect(smartQuotes("don't panic")).toBe('“don’t panic”');
  });

  it('converts internal straight double quotes to matched curly pairs', () => {
    const out = smartQuotes('a "b" c');
    expect(out).toBe('“a “b” c”');
  });

  it('trims surrounding whitespace', () => {
    expect(smartQuotes('  spaced  ')).toBe('“spaced”');
  });
});

describe('quoteFontSize', () => {
  it('shrinks as the quote gets longer (square)', () => {
    const short = quoteFontSize(50, 'square');
    const long = quoteFontSize(190, 'square');
    expect(short).toBeGreaterThan(long);
  });

  it('uses smaller sizes for the landscape (og) format', () => {
    expect(quoteFontSize(100, 'og')).toBeLessThan(quoteFontSize(100, 'square'));
  });

  it('clamps very long quotes to the smallest bucket', () => {
    expect(quoteFontSize(500, 'square')).toBe(38);
    expect(quoteFontSize(500, 'og')).toBe(30);
  });

  it('defaults to the square scale', () => {
    expect(quoteFontSize(100)).toBe(quoteFontSize(100, 'square'));
  });
});

describe('FORMATS', () => {
  it('defines a 1080 square and a 1200x630 landscape', () => {
    expect(FORMATS.square).toEqual({ width: 1080, height: 1080 });
    expect(FORMATS.og).toEqual({ width: 1200, height: 630 });
  });
});

describe('parsePosts', () => {
  let dir;

  const write = (name, frontmatter) => {
    const fm = Object.entries(frontmatter)
      .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
      .join('\n');
    writeFileSync(join(dir, name), `---\n${fm}\n---\nBody text.\n`);
  };

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'og-posts-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('returns only posts with a non-empty pull_quote, with a date-prefixed base', () => {
    write('2026-01-01-with-quote.md', {
      layout: 'post',
      title: 'With quote',
      date: '2026-01-01',
      pull_quote: 'A pithy thing.',
      pull_quote_attribution: 'Someone',
    });
    write('2026-02-02-no-quote.md', { layout: 'post', title: 'No quote', date: '2026-02-02' });
    write('2026-03-03-blank-quote.md', { layout: 'post', title: 'Blank', date: '2026-03-03', pull_quote: '   ' });

    const posts = parsePosts(dir);
    expect(posts).toHaveLength(1);
    expect(posts[0]).toMatchObject({
      slug: 'with-quote',
      base: '2026-01-01-with-quote',
      quote: 'A pithy thing.',
      attribution: 'Someone',
      sourceFile: '2026-01-01-with-quote.md',
    });
  });

  it('leaves attribution empty when the field is absent', () => {
    write('2026-01-01-anon.md', { layout: 'post', date: '2026-01-01', pull_quote: 'No name here.' });
    const posts = parsePosts(dir);
    expect(posts[0].attribution).toBe('');
  });

  it('throws when a pull_quote post has no date', () => {
    write('2026-01-01-dateless.md', { layout: 'post', pull_quote: 'No date here.' });
    expect(() => parsePosts(dir)).toThrow(/no date/i);
  });

  it('throws when two posts resolve to the same date-prefixed image name', () => {
    // Different filenames, but a slug override + matching frontmatter date collide.
    write('2024-01-01-a.md', { layout: 'post', date: '2024-01-01', slug: 'review', pull_quote: 'One.' });
    write('2024-01-02-b.md', { layout: 'post', date: '2024-01-01', slug: 'review', pull_quote: 'Two.' });
    expect(() => parsePosts(dir)).toThrow(/duplicate pull-quote image name/i);
  });

  it('does not treat same-slug posts on different dates as a collision', () => {
    write('2024-01-01-review.md', { layout: 'post', date: '2024-01-01', pull_quote: 'One.' });
    write('2025-01-01-review.md', { layout: 'post', date: '2025-01-01', pull_quote: 'Two.' });
    const bases = parsePosts(dir).map((p) => p.base).sort();
    expect(bases).toEqual(['2024-01-01-review', '2025-01-01-review']);
  });
});
