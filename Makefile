.PHONY: check dist

# compile to distribution
dist:
	npx tsc

# run test script
check: node_modules/typescript dist
	node dist/scripts/client-data-check

# deploy to aws
aws: dist
	node dist/scripts/deploy-aws

# install dependencies
node_modules/typescript:
	yarn

clean:
	rm -rf dist || rmdir /s /q dist

zip:
	(rm 3StrikesGame.zip || del 3StrikesGame.zip)
	powershell Compress-Archive ./dist,./node_modules 3StrikesGame.zip # windows
	# TODO # unix