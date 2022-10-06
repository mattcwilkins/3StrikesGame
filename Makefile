.PHONY: test dist dist-web

# run unit tests
test:
	npx jest

# compile to distribution
dist:
	npx tsc

dist-web:
	npx webpack

# deploy to aws
aws: dist
	node dist/scripts/deploy-aws

# install dependencies
node_modules/typescript:
	yarn

# delete distribution folder
clean:
	rm -rf dist || rmdir /s /q dist

# create a zip of this distribution to use in e.g. Lambda
zip:
	(rm 3StrikesGame.zip || del 3StrikesGame.zip)
	powershell Compress-Archive ./dist,./node_modules 3StrikesGame.zip # windows
	# TODO # unix