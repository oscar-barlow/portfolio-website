import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import postcss from 'postcss';
import { parseDesignTokens, requireDesignToken } from './design-tokens.mjs';

const TEXT_CONTRAST_PAIRS = [
  ['--color-text', '--color-background'],
  ['--color-heading', '--color-background'],
  ['--color-text-muted', '--color-background'],
  ['--color-action', '--color-background'],
  ['--color-action-hover', '--color-background'],
  ['--color-text', '--color-surface'],
  ['--color-text-muted', '--color-surface'],
  ['--color-on-dark', '--color-heading'],
  ['--color-on-dark', '--color-action'],
  ['--color-on-dark-muted', '--color-action'],
  ['--color-on-dark-subtle', '--color-heading'],
];

const FOCUS_CONTRAST_PAIRS = [
  ['--color-accent', '--color-background'],
  ['--color-accent', '--color-surface'],
  ['--color-on-dark', '--color-heading'],
  ['--color-on-dark', '--color-action'],
];

const LAYOUT_PATHS = [
  'src/_layouts/default.liquid',
  'src/_layouts/page.liquid',
  'src/_layouts/post.liquid',
  'src/_layouts/posts.liquid',
  'src/_layouts/CV.liquid',
];

function parseCssColor(value) {
  const rgba = value.trim().match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d*\.?\d+)\s*)?\)$/i);
  if (rgba) {
    return {
      channels: rgba.slice(1, 4).map(Number),
      alpha: rgba[4] === undefined ? 1 : Number(rgba[4]),
    };
  }

  const hex = value.trim().replace(/^#/, '');
  const expanded = hex.length === 3
    ? hex.split('').map((character) => character.repeat(2)).join('')
    : hex;

  if (!/^[0-9a-f]{6}$/i.test(expanded)) {
    throw new Error(`Unsupported colour value: ${value}`);
  }

  return {
    channels: [0, 2, 4].map((offset) => Number.parseInt(expanded.slice(offset, offset + 2), 16)),
    alpha: 1,
  };
}

function composite(foreground, background) {
  return foreground.channels.map((channel, index) => (
    (channel * foreground.alpha) + (background.channels[index] * (1 - foreground.alpha))
  ));
}

function relativeLuminance(channels) {
  const linearChannels = channels.map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return (0.2126 * linearChannels[0])
    + (0.7152 * linearChannels[1])
    + (0.0722 * linearChannels[2]);
}

export function contrastRatio(first, second) {
  const background = parseCssColor(second);
  if (background.alpha !== 1) throw new Error(`Background colour must be opaque: ${second}`);
  const foreground = composite(parseCssColor(first), background);
  const luminances = [relativeLuminance(foreground), relativeLuminance(background.channels)]
    .sort((a, b) => b - a);
  return (luminances[0] + 0.05) / (luminances[1] + 0.05);
}

function findRule(root, requiredSelectors) {
  let match;
  root.walkRules((rule) => {
    if (requiredSelectors.every((selector) => rule.selector.includes(selector))) match = rule;
  });
  return match;
}

export function validateAccessibilitySources({ tokens, css, navbar, layouts }) {
  const errors = [];

  for (const [foregroundToken, backgroundToken] of TEXT_CONTRAST_PAIRS) {
    const ratio = contrastRatio(
      requireDesignToken(tokens, foregroundToken),
      requireDesignToken(tokens, backgroundToken),
    );
    if (ratio < 4.5) {
      errors.push(`${foregroundToken} on ${backgroundToken} has ${ratio.toFixed(2)}:1 contrast; expected at least 4.5:1`);
    }
  }

  for (const [foregroundToken, backgroundToken] of FOCUS_CONTRAST_PAIRS) {
    const ratio = contrastRatio(
      requireDesignToken(tokens, foregroundToken),
      requireDesignToken(tokens, backgroundToken),
    );
    if (ratio < 3) {
      errors.push(`${foregroundToken} on ${backgroundToken} has ${ratio.toFixed(2)}:1 contrast; expected at least 3:1`);
    }
  }

  const root = postcss.parse(css);
  const focusRule = findRule(root, [
    'a[href]',
    'button',
    'input',
    'select',
    'textarea',
    'summary',
    '[tabindex]:not([tabindex="-1"])',
    ':focus-visible',
  ]);
  if (!focusRule || !focusRule.nodes.some(({ prop, value }) => prop === 'outline' && value.includes('--focus-ring-color'))) {
    errors.push('Shared :focus-visible rule must cover standard focusable controls and use --focus-ring-color');
  }

  const proseRule = findRule(root, ['.content-body', '.post-content', '.cv-body']);
  if (!proseRule || !proseRule.nodes.some(({ prop, value }) => prop === 'text-decoration-line' && value === 'underline')) {
    errors.push('Prose links must retain a non-colour underline');
  }

  if (!navbar.includes('class="skip-link"') || !navbar.includes('href="#main-content"')) {
    errors.push('Primary navigation must provide a skip link to #main-content');
  }
  if (!navbar.includes('aria-label="Primary"')) {
    errors.push('Primary navigation must expose its purpose to assistive technology');
  }

  for (const [path, source] of Object.entries(layouts)) {
    if (!source.includes('id="main-content"')) {
      errors.push(`${path} must expose the main-content skip-link target`);
    }
  }

  return errors;
}

async function run() {
  const [tokenCss, css, navbar, ...layoutSources] = await Promise.all([
    readFile(new URL('../frontend/styles/tokens.css', import.meta.url), 'utf8'),
    readFile(new URL('../frontend/styles/index.css', import.meta.url), 'utf8'),
    readFile(new URL('../src/_components/navbar.liquid', import.meta.url), 'utf8'),
    ...LAYOUT_PATHS.map((path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')),
  ]);
  const layouts = Object.fromEntries(LAYOUT_PATHS.map((path, index) => [path, layoutSources[index]]));
  const errors = validateAccessibilitySources({
    tokens: parseDesignTokens(tokenCss),
    css,
    navbar,
    layouts,
  });

  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
    return;
  }

  console.info('Targeted accessibility validation passed.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await run();
}
