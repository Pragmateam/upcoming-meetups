install:
	npm install

test:
	npm test

run:
	npm start $(eventName)

deploy:
	./infrastructure/deploy.sh

.PHONY: install test run deploy
