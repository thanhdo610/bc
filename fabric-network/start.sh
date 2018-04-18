#!/bin/bash
#

Red='\033[0;31m'
Green='\033[0;32m'
NC='\033[0m'

printf "${Green}################################################################################\n"
printf "${Green}#                                                                              #\n"
printf "${Green}#              START BUILDING TRIDENT-ARTS's DEV NETWORK                       #\n"
printf "${Green}#                                                                              #\n"
printf "${Green}################################################################################\n${NC}"

docker-compose -f docker-compose.yml down
docker-compose -f docker-compose.yml up -d ca.trident-arts.net orderer.trident-arts.net peer0.org1.trident-arts.net peer1.org1.trident-arts.net cli

#wait for Hyperledger Fabric to start
#incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
export FABRIC_START_TIMEOUT=10
export OPERATION_TIMEOUT=2

sleep ${FABRIC_START_TIMEOUT}

printf "${Green}# Create the channel.\n"
printf "${Green}# Note: the 2 -e parameters are to indicate the transaction is invoked by the channel administrator\n"
printf "${Green}----------\n${NC}"

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.trident-arts.net/users/Admin@org1.trident-arts.net/msp" cli peer channel create -o orderer.trident-arts.net:7050 -c tadevchannel -f /etc/hyperledger/configtx/channel.tx
sleep ${OPERATION_TIMEOUT}

printf "${Green}# Join peer0.org1.trident-arts.net to the channel.\n"
printf "${Green}----------\n${NC}"
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.trident-arts.net/users/Admin@org1.trident-arts.net/msp" peer0.org1.trident-arts.net peer channel fetch config tadevchannel.block -o orderer.trident-arts.net:7050 -c tadevchannel
sleep ${OPERATION_TIMEOUT}
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.trident-arts.net/users/Admin@org1.trident-arts.net/msp" peer0.org1.trident-arts.net peer channel join -b tadevchannel.block

printf "${Green}# Join peer1.org1.trident-arts.net to the channel.\n"
printf "${Green}----------\n${NC}"
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.trident-arts.net/users/Admin@org1.trident-arts.net/msp" peer1.org1.trident-arts.net peer channel fetch config tadevchannel.block -o orderer.trident-arts.net:7050 -c tadevchannel
sleep ${OPERATION_TIMEOUT}
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.trident-arts.net/users/Admin@org1.trident-arts.net/msp" peer1.org1.trident-arts.net peer channel join -b tadevchannel.block

printf "${Green}# All done.\n"
printf "${Green}################################################################################\n${NC}"
docker ps -a