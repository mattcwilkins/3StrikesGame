.PHONY: test dist dist-web

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

# create a zip of this distribution to use in e.g. Lambda
zip:
	(rm 3StrikesGame.zip || del 3StrikesGame.zip)
	powershell Compress-Archive ./dist,./node_modules 3StrikesGame.zip # windows
	# TODO # unix