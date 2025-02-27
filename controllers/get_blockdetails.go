package controllers

import (
	"context"
	"fmt"
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum/core/types"
	"github.com/pglekshmi/explorerGoPostgreSQL/config"
)

func GetBlockDetails(i uint64) (*types.Block, error) {
	Client,err := config.RetryConnectNode(5,2 * time.Second)
	if err!=nil&&Client==nil{
		fmt.Printf("Check your Blockchain network")
	}
	

	blockNum := new(big.Int).SetUint64(i)
    

	block, err := Client.BlockByNumber(context.Background(), blockNum)

	fmt.Println(block)
	return block, err

}
