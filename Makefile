default: deploy

build:
	./bin/bridgetown build

alphabetise-dictionary:
	sort -o dictionary.txt dictionary.txt

deploy: deps
	./bin/bridgetown deploy

deps:
	bundle install
	yarn install

start:
	./bin/bridgetown start

dev:
	yarn dev

test:
	yarn test:run

test-watch:
	yarn test

test-ui:
	yarn test:ui

test-coverage:
	yarn test:coverage

.PHONY: spellcheck
spellcheck:
	./node_modules/.bin/spellchecker --files src/*.md  src/_posts/*.md --language en-GB --dictionaries dictionary.txt ./node_modules/spellchecker-cli/dictionaries/base.txt --reports spag.junit.xml

.PHONY: validate-frontmatter
validate-frontmatter:
	@command -v jq >/dev/null || (echo "jq is required for front matter validation" && exit 2)
	@command -v yq >/dev/null || (echo "yq is required for front matter validation" && exit 2)
	@status=0; \
	for file in src/_posts/*.md; do \
		tmpfile=$$(mktemp); \
		awk 'NR==1 && $$0=="---" {in_fm=1; next} in_fm && $$0=="---" {exit} in_fm {print}' "$$file" > "$$tmpfile"; \
		if [ ! -s "$$tmpfile" ]; then \
			echo "$$file: missing front matter"; \
			status=1; \
			rm -f "$$tmpfile"; \
			continue; \
		fi; \
		if yq -o=json '.' "$$tmpfile" >/dev/null 2>&1; then \
			if ! yq -o=json '.' "$$tmpfile" | jq -e -f config/frontmatter.jq >/dev/null; then \
				echo "$$file: front matter validation failed"; \
				status=1; \
			fi; \
		else \
			if ! yq '.' "$$tmpfile" | jq -e -f config/frontmatter.jq >/dev/null; then \
				echo "$$file: front matter validation failed"; \
				status=1; \
			fi; \
		fi; \
		rm -f "$$tmpfile"; \
	done; \
	exit $$status

test-blog-email:
	cd blog-email && deno task test

deploy-blog-email:
	cd blog-email && deno task deploy

.PHONY: test test-watch test-ui test-coverage dev test-blog-email deploy-blog-email