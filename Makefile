.PHONY: test dist dist-web check

# run unit tests.
test:
	npx jest

# perform all steps in test, build, and deploy.
full:
	make test clean dist dist-web zip aws

# compile to server & infra distribution.
dist:
	npx tsc

# create web ui distribution.
dist-web:
	npx webpack

# webpack watch mode for UI development quick feedback loop.
ww:
	npx webpack -c webpack.config.dev.js --watch

# deploy to aws
aws: dist dist-web
	node dist/scripts/deploy-aws

# install development  and runtime dependencies.
node_modules/typescript:
	yarn

# delete distribution folder.
clean:
	rm -rf dist || rmdir /s /q dist
	rm -rf dist-web || rmdir /s /q dist-web

# create a zip of this distribution to use in e.g. Lambda.
zip:
	node dist/scripts/create-zip-workspace
	(cd workspace && yarn install --production)
	node dist/scripts/create-zip-file

# local testing script.
check:
	make dist
	node ./dist/scripts/client-data-check.js

# debugging arbitrary script.
debug:
	make dist
	node ./dist/scripts/infra-debug