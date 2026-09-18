import { describe, expect, it } from 'vitest';
import { validateDesignTokens } from '../scripts/validate-design-tokens.mjs';

describe('design token validation', () => {
  it('accepts declarations built from shared tokens', () => {
    const css = `
      :root {
        --color-text: #1a1a1a;
        --type-base: 1rem;
        --space-4: 1rem;
        --motion-duration-fast: 200ms;
      }
      .example {
        color: var(--color-text);
        font-size: var(--type-base);
        margin: var(--space-4);
        transition: color var(--motion-duration-fast) ease;
      }
    `;

    expect(validateDesignTokens(css)).toEqual([]);
  });

  it('rejects magic design values outside the token layer', () => {
    const css = `
      .example {
        color: #722f37;
        background: linear-gradient(135deg, #2f5f5f, #722f37);
        font-size: 1.3rem;
        margin-top: 1.7rem;
        transition: color 250ms ease;
      }
    `;

    expect(validateDesignTokens(css)).toHaveLength(5);
  });
});
