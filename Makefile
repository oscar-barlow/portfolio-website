deploy:
	bundle install
	yarn install
	./bin/bridgetown deploy

start:
	./bin/bridgetown start

.PHONY: spellcheck
spellcheck:
	./node_modules/.bin/spellchecker --files src/*.md  src/_posts/*.md