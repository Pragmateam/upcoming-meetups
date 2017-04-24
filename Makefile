install:
	npm install

test:
	npm test

run:
	npm start

deploy:
	./infrastructure/deploy.sh

.PHONY: install test run deploy
