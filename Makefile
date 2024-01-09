deploy:
	bundle install
	yarn install
	./bin/bridgetown deploy

start:
	./bin/bridgetown start