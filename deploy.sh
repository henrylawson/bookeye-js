#! /bin/bash

PWD=`pwd`

# Install dependencies
npm install pm2 -g --unsafe-perm

# Kill node process
pm2 delete bookeye

# Backup books.json
if [ -f ./master/bookeye-js-master/app/data/books.json ]; then
	cp -f ./master/bookeye-js-master/app/data/books.json ./books.json_bk
fi

# Download and extract latest application
rm -rf master
rm -f master.zip
wget https://github.com/henrylawson/bookeye-js/archive/master.zip
unzip ./master.zip -d master

# Create books.json and make and read/write/executable
mkdir ./master/bookeye-js-master/app/data
touch ./master/bookeye-js-master/app/data/books.json
chmod a+rwx ./master/bookeye-js-master/app/data/books.json

# Restore backed up books.json
if [ -f ./books.json_bk ]; then
	cp -f ./books.json_bk ./master/bookeye-js-master/app/data/books.json
fi

# Restart node
cd ./master/bookeye-js-master
npm install
pm2 start ./master/bookeye-js-master/usain --name "api"