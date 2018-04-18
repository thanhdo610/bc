#!/bin/bash
#

rm -rf bin/*
rm -rf nodejs/hfc-key-store/*
rm -rf nodejs/node_modules
docker network prune

curl -sSL https://raw.githubusercontent.com/hyperledger/fabric/v1.0.5/scripts/bootstrap.sh | bash -s 1.0.5
