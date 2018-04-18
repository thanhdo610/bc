#!/bin/bash
#

starttime=$(date +%s)


####  Install chaincode
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.trident-arts.net/users/Admin@org1.trident-arts.net/msp" cli peer chaincode install -n fabcar -v 1.0 -p github.com/fabcar
####  Instantiate the chaincode - administrator permission
printf '===Instantiate the chaincode - administrator permission==='
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.trident-arts.net/users/Admin@org1.trident-arts.net/msp" cli peer chaincode instantiate -C tadevchannel -n fabcar -v 1.0 -c '{"Args":[""]}'
sleep 10
#### Invoke the chaincode - administrator permission : un comment this command when you want to invoke a func after install chaincode
#printf '===Invoke the chaincode - administrator permission==='
#docker exec -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.trident-arts.net/users/Admin@org1.trident-arts.net/msp" cli peer chaincode invoke -C tadevchannel -n fabcar -c '{"function":"initLedger","Args":[""]}'

printf "\nTotal setup execution time : $(($(date +%s) - starttime)) secs ...\n\n\n"
printf "Start by installing required packages run 'npm install'\n"
printf "Then run 'node enrollAdmin.js', then 'node registerUser'\n\n"
printf "The 'node invoke.js' will fail until it has been updated with valid arguments\n"
printf "The 'node query.js' may be run at anytime once the user has been registered\n\n"
