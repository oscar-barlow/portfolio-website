# Bridgetown Website README

Welcome to your new Bridgetown website! You can update this README file to provide additional context and setup information for yourself or other contributors.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Install](#install)
- [Development](#development)
- [Commands](#commands)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Prerequisites

### Nix and direnv (recommended)

Install Nix with the `nix-command` and `flakes` experimental features enabled,
then install direnv and enable its hook in your shell (for zsh, add
`eval "$(direnv hook zsh)"` to `~/.zshrc`). From this repo, run:

```sh
direnv allow
bundle install
yarn install --frozen-lockfile
make start
```

The pinned flake provides Ruby 3.2.2, Bundler, Node 24.19.0, Yarn Classic, a C/C++
compiler, Make, and the libraries and validation tools used by this repo.
Project gems install into `vendor/bundle`; direnv's cache and any Bundler
version requested by `Gemfile.lock` live in `.direnv/`. Both directories
are ignored by Git. Dependencies are installed explicitly, not on shell entry.
You can also enter the environment with `nix develop path:.` without direnv.

The Ruby and Node versions match `.ruby-version` and `.nvmrc`, which Render
uses for its builds. The flake checks both versions during evaluation so a
pin update cannot silently introduce a mismatch. When changing either version,
select a matching nixpkgs snapshot in `flake.nix` and regenerate `flake.lock`
with `nix flake update`. Ruby uses a separate historical snapshot to provide
the exact version.

### Manual setup

- [GCC](https://gcc.gnu.org/install/)
- [Make](https://www.gnu.org/software/make/)
- [Ruby](https://www.ruby-lang.org/en/downloads/)
  - `>= 2.7`
- [Bridgetown Gem](https://rubygems.org/gems/bridgetown)
  - `gem install bridgetown -N`
- [Node](https://nodejs.org)
  - see `.nvmrc` for the exact version (`nvm use` picks it up automatically)
- [Yarn](https://yarnpkg.com)

## Install

```sh
cd bridgetown-site-folder
bundle install && yarn install
```
> Learn more: [Bridgetown Getting Started Documentation](https://www.bridgetownrb.com/docs/).

## Development

To start your site in development mode, run `bin/bridgetown start` and navigate to [localhost:4000](https://localhost:4000/)!

Use a [theme](https://github.com/topics/bridgetown-theme) or add some [plugins](https://www.bridgetownrb.com/plugins/) to get started quickly.

### Commands

```sh
# running locally
bin/bridgetown start

# build & deploy to production
bin/bridgetown deploy

# load the site up within a Ruby console (IRB)
bin/bridgetown console
```

> Learn more: [Bridgetown CLI Documentation](https://www.bridgetownrb.com/docs/command-line-usage)

## Design system

`frontend/styles/tokens.css` is the canonical source for the site's semantic
colours, gradients, type scale, spacing scale, motion and focus values. The OG
image generator reads its brand colours from the same file, and tests keep the
favicons aligned with the canonical gradient stops.

Run the design-system guard before committing CSS changes:

```sh
yarn lint:design
# or
make lint-design
```

The guard rejects colour and gradient literals, one-off font sizes, spacing
values and motion durations outside the token layer. The third-party syntax
highlighting theme remains intentionally independent.

Run the targeted accessibility guard when changing colours, focus states,
prose links, navigation, or layouts:

```sh
yarn lint:accessibility
# or
make lint-accessibility
```

This checks the site's documented contrast pairings and structural safeguards.
It supports the WCAG-informed design direction but is not a claim of complete
standards conformance or a substitute for manual keyboard review.

## Writing posts

Posts live in `src/_posts/` as `YYYY-MM-DD-slug.md`. Required frontmatter is
`layout`, `title`, `description` (50–300 chars), `date`, and `pull_quote` — all
validated by `make validate-frontmatter`.

```yaml
pull_quote: "A pithy line from the post."          # required
pull_quote_attribution: "Oscar Barlow, Infrux"     # optional; not always the author
```

`pull_quote` drives a branded share image: the build generates a 1080×1080
square (for uploading directly to a LinkedIn post) and a 1200×630 landscape
(used as the post's `og:image`) into
`output/images/pull-quotes/{YYYY-MM-DD}-{slug}.png` and `-og.png` (the date is
the post's frontmatter date). Each image carries a call-to-action back to the
site. The images regenerate on every build; you can also run the generator on
its own:

```sh
node scripts/generate-og-images.mjs
```

## Deployment

You can deploy Bridgetown sites on hosts like Render or Vercel as well as traditional web servers by simply building and copying the output folder to your HTML root.

> Read the [Bridgetown Deployment Documentation](https://www.bridgetownrb.com/docs/deployment) for more information.

## Contributing

If repo is on GitHub:

1. Fork it
2. Clone the fork using `git clone` to your local development machine.
3. Create your feature branch (`git checkout -b my-new-feature`)
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin my-new-feature`)
6. Create a new Pull Request
