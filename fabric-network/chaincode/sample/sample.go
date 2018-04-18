package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

// SmartContract Define a sample structure of the smart contract chaincode
type SmartContract struct {
}

// Wallet datastructure that map global ID to a balance value
// the globalID is used as the key in the ledger state
type Wallet struct {
	Balance float64 `json:"balance"`
}

// Init method is called when the Smart Contract is instantiated by the blockchain network
// Best practice is to have any Ledger initialization in separate function
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) peer.Response {
	return shim.Success(nil)
}

// Invoke method is called as a result of an application request to run the Smart Contract
// The calling application program has also specified the particular smart contract function to be called, with arguments
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) peer.Response {
	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "createWallet" {
		return s.createWallet(APIstub, args[0])
	} else if function == "queryWallet" {
		return s.queryWallet(APIstub, args[0])
	}
	return shim.Error("Invalid Smart Contract function name.")
}

// Init the ledger with 10 wallet, 0 balance
func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) peer.Response {
	for i := 0; i < 10; i++ {
		s.createWallet(APIstub, "SampleGlobalID_"+string(i))
	}
	return shim.Success(nil)
}

// Create a new wallet and set balance to 0
// We use GlobalID as a key to the ledger state
// params: GlobalID
func (s *SmartContract) createWallet(APIstub shim.ChaincodeStubInterface, globalID string) peer.Response {
	existed, _ := APIstub.GetState(globalID)

	if existed != nil {
		return shim.Error("Wallet already exist")
	}

	var wallet = Wallet{Balance: 0}
	walletAsBytes, _ := json.Marshal(wallet)
	APIstub.PutState(globalID, walletAsBytes)

	return shim.Success(nil)
}

// Get a wallet balance if it exists
func (s *SmartContract) queryWallet(APIstub shim.ChaincodeStubInterface, globalID string) peer.Response {
	walletAsBytes, _ := APIstub.GetState(globalID)
	if walletAsBytes == nil {
		return shim.Error("GlobalID does not exist")
	}
	return shim.Success(walletAsBytes)
}

func main() {
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Println("Could not start SampleChaincode")
	} else {
		fmt.Println("SampleChaincode successfully started")
	}
}
