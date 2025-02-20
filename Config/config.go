package config

import (
	

	"github.com/ethereum/go-ethereum/ethclient"
)

func ConnectNode()(*ethclient.Client,error){
	url := "http://127.0.0.1:8545"

	client,err:= ethclient.Dial(url)

	

	return client,err

}