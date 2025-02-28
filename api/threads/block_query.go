package threads

import (
	"context"
	"fmt"
	"github.com/pglekshmi/explorerGoPostgreSQL/config"
	"github.com/pglekshmi/explorerGoPostgreSQL/controllers"
	"github.com/pglekshmi/explorerGoPostgreSQL/models"
	"gorm.io/gorm"
	"log"
	"time"
)

func BlockQuery(DB *gorm.DB) {
	Client, err := config.RetryConnectNode(5, 2*time.Second)
	if err != nil {
		fmt.Println("Error in connecting to Node")
	}
	latestBlockNumber, err := Client.BlockNumber(context.Background())
	if err != nil {
		fmt.Println("Something wrong getting data")
	}

	var lastBlock models.Block

	if err := DB.Last(&lastBlock).Error; err != nil {
		fmt.Println("Something wrong on getting data from DB")
	}

	i := lastBlock.Number + 1
	for {

		if i > latestBlockNumber {
			break // Exit when i exceeds the latest block number
		}

		blocks, err := controllers.GetBlockDetails(i)

		if err != nil {
			fmt.Println("Cannot get block details")
		}
		newBlock := models.Block{
			Number:     blocks.NumberU64(),
			Hash:       blocks.Hash().Hex(),
			ParentHash: blocks.ParentHash().Hex(),
			GasLimit:   blocks.GasLimit(),
			Time:       blocks.Time(),
			Size:       blocks.Size(),
		}
		if err := DB.Create(&newBlock).Error; err != nil {
			fmt.Println("Error creating new block:", err)
		} else {
			fmt.Println("Block inserted successfully!")
		}

		if len(blocks.Body().Transactions) == 0 {
			fmt.Println("No transactions in this block, skipping to the next block")
			i++ // Move to the next block
			continue
		}
		Count := int64(0)
		contractCount := 0
		contractCall := models.Contract_call{}

		for _, k := range blocks.Body().Transactions {

			toAddress := controllers.TransAddressCheck(k)
			tHash := controllers.TransHashCheck(k)
			tType := controllers.TransTypeCheck(k)
			tValue := controllers.TransValueCheck(k)
			if k.To() == nil {

				contractCount++
				receipt, err := Client.TransactionReceipt(context.Background(), k.Hash())

				if err == nil { //to store contract address to contract_call table
					fmt.Println("Contract Address Found")
					contractCall.Address = receipt.ContractAddress.Hex()
					if err := DB.Create(&contractCall).Error; err != nil {
						fmt.Println("Something wrong with connecting Contract call Table")
					}
				}
			}

			err := DB.Model(&models.Contract_call{}).
				Where("Address = ?", toAddress).
				Update("Calls", gorm.Expr("Calls + 1")).Error

			if err != nil {
				fmt.Println("No such contract address")
			}

			Count++

			newTransaction := models.Transaction{
				Thash: tHash,
				// To:blocks.Body().Transactions[k].To().Hex(),
				To: toAddress,

				Type:        tType,
				Gas:         k.Gas(),
				Value:       tValue,
				BlockNumber: newBlock.Number,
			}

			if err := DB.Create(&newTransaction).Error; err != nil {
				fmt.Println("Something went wrong", err)
				log.Fatalln("Something wrong happended on transaction db")
			}
		}
		transCount := models.TransCount{
			Timestamp:     blocks.Time(),
			BlockNumber:   blocks.NumberU64(),
			Count:         Count,
			ContractCount: contractCount,
		}
		if err := DB.Create(&transCount).Error; err != nil {
			fmt.Println("Something went wrong", err)

		}
		fmt.Println("All Transactions entered")
		i++

	}
}

func Task(DB *gorm.DB) {
	ticker := time.NewTicker(15 * time.Second)
	defer ticker.Stop()

	for t := range ticker.C {

		fmt.Println("Executing BlockQuery...", t)
		BlockQuery(DB)

	}
}
