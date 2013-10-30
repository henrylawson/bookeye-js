#! /bin/bash

rm -rf master
rm -f master.zip
wget https://github.com/henrylawson/bookeye-js/archive/master.zip
unzip ./master.zip -d master
cd ./master/bookeye-js-master
npm install
cmd="node usain"
$cmd &