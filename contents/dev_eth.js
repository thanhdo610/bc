var dev_eth = `

#### Folder structure

![HLF - Folders](assets/img/eth.png)


#### Network architecture
The TADEV's Quorum network will run with following structure:
    
    - All nodes: --syncmode full --mine --rpc --rpcaddr 0.0.0.0 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul
    - Node 1: --rpcport 22000 --port 21000
    - Node 2: --rpcport 22001 --port 21001
    - Node 3: --rpcport 22002 --port 21002 
    - Node 4: --rpcport 22003 --port 21003 
    - Node 5: --rpcport 22004 --port 21004 

**Important**: This network is running in **Istanbul BFT** mode intead of default raft mode.

#### Commands list

    istanbul-init.sh: 
        What: Initialize accounts and keystores
        When: First time you built network
        How : Run ./istanbul-init.sh
    istanbul-start.sh: 
        What: Launch constellation and geth nodes, then send a private transaction
        When: When you want to start the network
        How : When you want to specify which node to run, edit istanbul-start.sh by adding the node information you want to enable
              Run ./istanbul-start.sh
    stop.sh: 
        What: Stop all constellation and geth nodes
        When: When you want to stop the network
        How : Rung ./stop.sh
    installSmartcontract.sh:
        What: To deploy smart contract into Quorum
        How : Create javaScript deploy code, and then run './installSmartcontract.sh your-deploy-code.js'

#### Start network
Set .sh file to runable:

    chmod +x *.sh

Initial: (**Note**: Run in the first time you start network )

    ./istanbul-init.sh

Start network: 

    ./istanbul-start.sh
	

Deploy Smartcontract

Using 'simplestorage.sol' for example.

First, install solcjs

	npm install -g solc
	
Create json Interface & bin file:

	solcjs --bin --abi simplestorage.sol
	// 2 files generated:
	// simplestorage_sol_simplestorage.abi
	// simplestorage_sol_simplestorage.bin

Create a js file, example:

	var abi = content of simplestorage_sol_simplestorage.abi above;

	var bytecode = "0x" + content of simplestorage_sol_simplestorage.bin above;

	var simpleContract = web3.eth.contract(abi);
	
    // Set value for uint public storedData and deploy contract
    // Set gas to max, see "gasLimit": "0x47b760" in file istanbul-genesis.json

	var simple = simpleContract.new(42, {from:web3.eth.accounts[0], data: bytecode, gas: 0x47b760}, function(e, contract) {
		if (e) {
			console.log("err creating contract", e);
		} else {
			if (!contract.address) {
				console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
			} else {
				console.log("Contract mined! Address: " + contract.address);
				console.log(contract);
			}
		}
	});

Deploy:

    ./installSmartcontract.sh your-script.js

    // Contract transaction send: TransactionHash: 0x3558ef35bea2c8615e7160e9eb061e1ad72a8a852117984177fce0447824f4fa waiting to be mined...
    // true

    
#### Dive into console

Login into geth console: 

    PRIVATE_CONFIG=qdata/c1/tm.ipc geth attach ipc:qdata/dd1/geth.ipc

get Block information:

    > eth.getBlock(1757201)
    {
    difficulty: 54831103175033,
    extraData: "0xd783010406844765746887676f312e342e32856c696e7578",
    gasLimit: 4712388,
    gasUsed: 3059685,
    hash: "0xec4cd4f70ab16718ada2795b0b24f2be6498f4fca3e0b6b79e045933814f56e7",
    logsBloom: "0x000000000000000",
    miner: "0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5",
    nonce: "0x8b119d486f87adf5",
    number: 1757201,
    parentHash: "0xd4bd6a69b51d768950f683151e009410b74403f8dc2780bf03697e3a6e4919c7",
    receiptRoot: "0x23ed6181c74edbcd2b29aa317dc84d320788a2c98b818b5fc49c475ef1d5164a",
    sha3Uncles: "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    size: 10736,
    stateRoot: "0x857cd117a16db6661eee8256702aa6879ecceccdb05a13637bad147760762547",
    timestamp: 1466691328,
    totalDifficulty: 30162772625997950877,
    transactions: ["0xd5875cdc5dea095e713b2409d585bd713d7f67bf1f0a0143293c00dc3db187da""],
    transactionsRoot: "0xfe3316b06b1fad15e6e1c0e06ad2043213f36518f122ad6dff0293fe57d26d5f",
    uncles: []
    }

get Transaction information:

    > eth.getTransaction("0xd5875cdc5dea095e713b2409d585bd713d7f67bf1f0a0143293c00dc3db187da")
    {
    blockHash: "0xec4cd4f70ab16718ada2795b0b24f2be6498f4fca3e0b6b79e045933814f56e7",
    blockNumber: 1757201,
    from: "0x0b21002b890bf8a03db09cf6f4290b37d92adc90",
    gas: 21000,
    gasPrice: 20466997395,
    hash: "0xd5875cdc5dea095e713b2409d585bd713d7f67bf1f0a0143293c00dc3db187da",
    input: "0x",
    nonce: 10,
    to: "0xe7a84e176cde685ca2fb47aea022343b76c27cd7",
    transactionIndex: 0,
    value: 113883784656551848
    }

`;