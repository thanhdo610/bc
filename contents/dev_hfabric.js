var dev_hfabric = `

#### Folder structure

![HLF - Folders](assets/img/hlf.png)

    bin: platform-specific binaries you will need to set up your network.
    chaincode: example chaincode, your custom-chaincode will stored here, and automaticly sync with CLI docker container.
    config & crypto-config: generated config for TADEV network. By defaut all needed informations is fulfilled.
    nodejs: javaScript runable file to querry data from ledger
    *.sh: runable file to generate, start, stop network
    *.yml/yaml: config file to generate TADEV network


#### Network architecture
The TADEV's Hyperledger network will run with following structure:

    # See fabric-network/crypto-config.yaml for more informations
    TadevOrdererGenesis:
        Orderer:
            <<: *OrdererDefaults
            Organizations:
                - *OrdererOrg
        Consortiums:
            TADEVConsortium:
                Organizations:
                    - *Org1
    TadevChannel:
        Consortium: TADEVConsortium
        Application:
            <<: *ApplicationDefaults
            Organizations:
                - *Org1

And services:

    # See fabric-network/docker-compose.yml for more informations
    ca.trident-arts.net:
        image: hyperledger/fabric-ca:x86_64-1.0.5
        ports:
            - "7054:7054"

    orderer.trident-arts.net:
        image: hyperledger/fabric-orderer:x86_64-1.0.5
        ports:
            - 7050:7050
    
    peer0.org1.trident-arts.net:
        ports:
            - 7051:7051

	peer1.org1.trident-arts.net:
        ports:
            - 8051:7051

    cli:
        container_name: cli
        image: hyperledger/fabric-tools:x86_64-1.0.5
        tty: true
        environment:
        - CORE_PEER_ID=cli
            - CORE_PEER_ADDRESS=peer0.org1.trident-arts.net:7051
            - CORE_PEER_LOCALMSPID=Org1MSP

Main channel:

    tadevchannel

#### Commands list

    - ./init.sh: 
            What: Initial, this command will help you to cleaning your system environment and installing needed dependancy.
            When: First time you built network
            How : Run ./init.sh
                  Choose "y" if you want to cleaning your system environment then install needed dependancy
                  Choose "n" if you just want install needed dependancy 

    - ./generate.sh: 
            What: Generate crypto config, you must edit cert file name at docker-compose.yml line 18 after run this command.
            When: When you change config content you must run generate.sh
            How : If you have any change in orderer genesis block name or channel name, edit generate.sh file to change to the corresponding name
                  Run ./generate.sh

    - ./start.sh: 
            What: Start the network
            When: When you want to start the network
            How : If you have any change in config file like orderer genesis block name, channel name, peer name...ect edit start.sh file to change to the corresponding name
                  Run ./start.sh

    - ./installChaincode.sh: 
            What: Install your chaincode to cli, and then Instantiate to oderer or peer.
            When: When you want deploy your chaincode
            How : By default, installChaincode.sh will install fabcar chaincode for your testing purpose. 
                  Your custom chaincode file will be store in fabric-network/chaincode folder and automaticly sync with cli service.
                 → Refer guide Chaincode deploy to deploy your chaincode

    - ./upgradeChaincode.sh
            What: Install your new version chaincode to cli, and then Upgrade to oderer or peer.
            When: When you want upgrade your chaincode
            How : By default, upgradeChaincode.sh will install fabcarv2 chaincode for your testing purpose.
                 → Refer guide Chaincode upgrede to deploy your new version chaincode
  

    - ./stop.sh: 
            What: Shut down the Docker containers that might be currently running
            When: When you want to stop the network
            How : ./stop.sh

    - ./teardown.sh: 
            What: Completely remove your network.
            When: When you want to remove the network
            How : Run ./teardown.sh

#### Start network

Set .sh file to runalble:

    chmod +x *.sh

Initial: (**Note:** Run in the first time you start network )

    WARNING! This will remove all networks not used by at least one container.
    ./init.sh

Start network:

    ./start.sh

#### Chaincode deploy
./installChaincode.sh is a example of deploy chaincode, so you must edit ./installChaincode.sh then run to deploy your new chaincode.

Install chaincode

    docker exec -e "CORE_PEER_LOCALMSPID=*Enter core peer local mspID you defined*" -e "CORE_PEER_MSPCONFIGPATH=*Enter Core peer MSPconfig path you defined*" cli peer chaincode install -n *enter chaincode id* -v *enter version* -p *enter chaincode path in docker*

    example:
    docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.trident-arts.net/users/Admin@org1.trident-arts.net/msp" cli peer chaincode install -n fabcar -v 1.0 -p github.com/fabcar

Instantiate the chaincode

    docker exec -e "CORE_PEER_LOCALMSPID=*Enter core peer local mspID you defined*" -e "CORE_PEER_MSPCONFIGPATH=*Enter Core peer MSPconfig path you defined*" cli peer chaincode instantiate -C *enter your channel name* -n *enter chaincode id* -v *enter version* -c '{"Args":[""]}'

    example:
    docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.trident-arts.net/users/Admin@org1.trident-arts.net/msp" cli peer chaincode instantiate -C tadevchannel -n fabcar -v 1.0 -c '{"Args":[""]}'

Check installed chaincode

    docker ps -a | grep "chaincode"

#### Chaincode upgrade

Install new version chaincode

    docker exec -e "CORE_PEER_LOCALMSPID=*Enter core peer local mspID you defined*" -e "CORE_PEER_MSPCONFIGPATH=*Enter Core peer MSPconfig path you defined*" cli peer chaincode install -n *enter chaincode id* -v *enter new version* -p *enter chaincode path in docker*

    example:
    docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.trident-arts.net/users/Admin@org1.trident-arts.net/msp" cli peer chaincode install -n fabcar -v 2.0 -p github.com/fabcarv2

Upgrade the chaincode

    docker exec -e "CORE_PEER_LOCALMSPID=*Enter core peer local mspID you defined*" -e "CORE_PEER_MSPCONFIGPATH=*Enter Core peer MSPconfig path you defined*" cli peer chaincode upgrade -C *enter your channel name* -n *enter chaincode id* -v *enter new version* -c '{"Args":[""]}'

    example:
    docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.trident-arts.net/users/Admin@org1.trident-arts.net/msp" cli peer chaincode upgrade -C tadevchannel -n fabcar -v 2.0 -c '{"Args":[""]}'

Check upgraded chaincode

    docker ps -a | grep "chaincode"

`;