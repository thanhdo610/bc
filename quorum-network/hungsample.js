var abi = content of simplestorage_sol_simplestorage.abi above;

var bytecode = "0x" + content of simplestorage_sol_simplestorage above;

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
