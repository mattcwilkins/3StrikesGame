.PHONY: check dist

# compile to distribution
dist:
	npx tsc

# run test script
check: node_modules/typescript dist
	node dist/scripts/client-data-check

# install dependencies
node_modules/typescript:
	yarn