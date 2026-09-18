import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseDesignTokens, requireDesignToken } from '../scripts/design-tokens.mjs';

describe('canonical design-token source', () => {
  const css = readFileSync('frontend/styles/tokens.css', 'utf8');
  const tokens = parseDesignTokens(css);

  it('exposes the canonical brand colours to non-CSS assets', () => {
    expect(requireDesignToken(tokens, '--color-accent')).toBe('#2F5F5F');
    expect(requireDesignToken(tokens, '--color-action')).toBe('#722F37');
  });

  it('fails clearly when a required token is absent', () => {
    expect(() => requireDesignToken(tokens, '--color-missing')).toThrow(
      'Missing required design token: --color-missing',
    );
  });

  it.each(['src/favicon.svg', 'src/favicon-16.svg', 'src/favicon-32.svg'])(
    'keeps %s aligned with the canonical brand gradient stops',
    (path) => {
      const favicon = readFileSync(path, 'utf8');
      expect(favicon).toContain(requireDesignToken(tokens, '--color-accent'));
      expect(favicon).toContain(requireDesignToken(tokens, '--color-action'));
      expect(favicon).toContain(requireDesignToken(tokens, '--color-on-dark-muted'));
    },
  );
});
