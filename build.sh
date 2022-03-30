#!/usr/bin/env bash

OUT_DIR="public/"

if [[ ! -d public ]]; then
	echo "Creating public dir"
	mkdir public
fi

echo "Building..."

yarn

yarn build:prod

echo "Copying files to publish dir"

cp -r src/{*.js,index.html,ringbearer} public/

