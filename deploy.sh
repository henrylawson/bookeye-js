#! /bin/bash

# Kill node process
# ??

# Backup books.json
if [ -f ./master/bookeye-js-master/app/data/books.json ]; then
	cp -f ./master/bookeye-js-master/app/data/books.json ./books.json_bk
fi

# Download and extract latest application
rm -rf master
rm -f master.zip
wget https://github.com/henrylawson/bookeye-js/archive/master.zip
unzip ./master.zip -d master

# Restore backed up books.json
if [ -f ./books.json_bk ]; then
	mkdir ./master/bookeye-js-master/app/data
	cp -f ./books.json_bk ./master/bookeye-js-master/app/data/books.json
fi

# Restart node
cd ./master/bookeye-js-master
npm install
cmd="node usain"
$cmd &
PID=$!
echo $PID >> ./pid
