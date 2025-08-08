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

.PHONY: test test-watch test-ui test-coverage dev