import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import postcss from 'postcss';

const COLOR_LITERAL = /#[0-9a-f]{3,8}\b|rgba?\(|\b(?:black|white)\b/i;
const GRADIENT_LITERAL = /(?:linear|radial)-gradient\(/i;
const TIME_LITERAL = /(?:^|[\s,])\d*\.?\d+(?:ms|s)\b/i;
const SPACING_LITERAL = /\d*\.?\d+(?:px|rem|em)\b/i;
const MOTION_PROPERTIES = new Set([
  'animation',
  'animation-duration',
  'transition',
  'transition-duration',
]);
const SPACING_PROPERTIES = /^(?:margin|padding|gap|row-gap|column-gap)(?:-|$)/;

function isRootToken(declaration) {
  return declaration.parent?.type === 'rule'
    && declaration.parent.selector === ':root'
    && declaration.prop.startsWith('--');
}

export function validateDesignTokens(css, from = 'CSS') {
  const root = postcss.parse(css, { from });
  const errors = [];

  root.walkDecls((declaration) => {
    if (isRootToken(declaration)) return;

    const location = `${from}:${declaration.source.start.line}`;

    if (COLOR_LITERAL.test(declaration.value) || GRADIENT_LITERAL.test(declaration.value)) {
      errors.push(`${location} ${declaration.prop} must use a semantic colour or gradient token`);
    }

    if (declaration.prop === 'font-size' && !declaration.value.includes('var(--type-')) {
      errors.push(`${location} font-size must use the shared type scale`);
    }

    if (SPACING_PROPERTIES.test(declaration.prop)
      && SPACING_LITERAL.test(declaration.value)
      && !declaration.value.includes('var(--space-')) {
      errors.push(`${location} ${declaration.prop} must use the shared spacing scale`);
    }

    if (MOTION_PROPERTIES.has(declaration.prop)
      && TIME_LITERAL.test(declaration.value)
      && !declaration.value.includes('var(--motion-duration-')) {
      errors.push(`${location} ${declaration.prop} must use a shared motion duration`);
    }
  });

  return errors;
}

async function run() {
  const stylesheets = [
    ['frontend/styles/tokens.css', new URL('../frontend/styles/tokens.css', import.meta.url)],
    ['frontend/styles/index.css', new URL('../frontend/styles/index.css', import.meta.url)],
  ];
  const results = await Promise.all(stylesheets.map(async ([name, path]) => {
    const css = await readFile(path, 'utf8');
    return validateDesignTokens(css, name);
  }));
  const errors = results.flat();

  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
    return;
  }

  console.info('Design token validation passed.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await run();
}
