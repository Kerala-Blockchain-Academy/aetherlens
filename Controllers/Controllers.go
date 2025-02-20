package controllers

import (
	"context"
	"fmt"
	"math/big"

	"github.com/ethereum/go-ethereum/core/types"
	"github.com/pglekshmi/explorerGoPostgreSQL/Config"
)

func GetBlockDetails(i uint64) (*types.Block, error) {
	Client,err := config.ConnectNode()
	if err!=nil&&Client==nil{
		fmt.Printf("Check your Blockchain network")
	}
	if i== 0{
	    block, err := Client.BlockByNumber(context.Background(), nil)
		
		return block,err
	}

	blockNum := new(big.Int).SetUint64(i)
    

	block, err := Client.BlockByNumber(context.Background(), blockNum)

	fmt.Println(block)
	return block, err

}
