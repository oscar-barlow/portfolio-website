import postcss from 'postcss';

export function parseDesignTokens(css, from = 'design tokens') {
  const root = postcss.parse(css, { from });
  const tokens = {};

  root.walkRules(':root', (rule) => {
    rule.walkDecls(/^--/, (declaration) => {
      tokens[declaration.prop] = declaration.value;
    });
  });

  return tokens;
}

export function requireDesignToken(tokens, name) {
  const value = tokens[name];
  if (!value) throw new Error(`Missing required design token: ${name}`);
  return value;
}
