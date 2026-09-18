import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseDesignTokens } from '../scripts/design-tokens.mjs';
import { contrastRatio, validateAccessibilitySources } from '../scripts/validate-accessibility.mjs';

const layoutPaths = [
  'src/_layouts/default.liquid',
  'src/_layouts/page.liquid',
  'src/_layouts/post.liquid',
  'src/_layouts/posts.liquid',
  'src/_layouts/CV.liquid',
];

describe('targeted accessibility validation', () => {
  it('calculates WCAG contrast ratios', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21);
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1);
    expect(contrastRatio('rgba(255, 255, 255, 0.5)', '#000000')).toBeCloseTo(5.28, 1);
  });

  it('keeps contrast, focus, prose-link, and skip-link safeguards in place', () => {
    const tokenCss = readFileSync('frontend/styles/tokens.css', 'utf8');
    const layouts = Object.fromEntries(
      layoutPaths.map((path) => [path, readFileSync(path, 'utf8')]),
    );

    expect(validateAccessibilitySources({
      tokens: parseDesignTokens(tokenCss),
      css: readFileSync('frontend/styles/index.css', 'utf8'),
      navbar: readFileSync('src/_components/navbar.liquid', 'utf8'),
      layouts,
    })).toEqual([]);
  });
});
