#!/bin/bash
#
# Copyright TRIDENT-ARTS Corp All Rights Reserved
#

# Shut down the Docker containers for the system tests.
docker-compose -f docker-compose.yml kill && docker-compose -f docker-compose.yml down

# remove the local state
rm -rf nodejs/hfc-key-store/*

docker network prune
# remove chaincode docker images
docker rmi -f $(docker images dev-* -q)

# Your system is now clean
