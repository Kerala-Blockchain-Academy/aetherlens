package controllers

import (
	"context"
	"fmt"
	"github.com/pglekshmi/explorerGoPostgreSQL/models"
	"gorm.io/gorm"
	"github.com/ethereum/go-ethereum/ethclient"
)

func BlockDetails(i uint64,j uint64,DB *gorm.DB,Client *ethclient.Client) {
	

	var firstBlock models.Block

	if err := DB.First(&firstBlock).Error; err != nil { //Checking whether DB is empty
		
		for { // Getting all the blocks from 0 to latest
			
			if i >j {
				break // Exit when i exceeds the latest block number
			}

			blocks, err := GetBlockDetails(i)

			if err != nil {
				fmt.Println(err)
				continue
			}
			newBlock := models.Block{
				Number:     blocks.NumberU64(),
				Hash:       blocks.Hash().Hex(),
				ParentHash: blocks.ParentHash().Hex(),
				GasLimit:   blocks.GasLimit(),
				Time:       blocks.Time(),
				Size:       blocks.Size(),
			}
			if err := DB.Create(&newBlock).Error; err != nil { //Entering block details to blocks Table
				fmt.Println("Error creating new block:", err)
			} else {
				fmt.Printf("Block %d inserted successfully!\n", i)
			}

			if len(blocks.Body().Transactions) == 0 { // Checking whether transactions present
				fmt.Println("No transactions in this block, skipping to the next block")
				i++ // Move to the next block
				continue
			}
			Count := int64(0)
			contractCount := 0
			contractCall := models.Contract_call{}

			for _, k := range blocks.Body().Transactions {

				// Checking all the transaction fields
				toAddress := TransAddressCheck(k)
				tHash := TransHashCheck(k)
				tType := TransTypeCheck(k)
				tValue := TransValueCheck(k)

				if k.To() == nil {
					contractCount++
					receipt, err := Client.TransactionReceipt(context.Background(), k.Hash())
					if err == nil { //to store contract address to contract_call table
						fmt.Println("Contract Address Found")
						contractCall.Address = receipt.ContractAddress.Hex()
						if err := DB.Create(&contractCall).Error; err != nil { // Entering details to contract_call Table
							fmt.Println("Something wrong with connecting Contract call Table")
						}
					}
				}

				err := DB.Model(&models.Contract_call{}). // Entering details to contract_call Table
										Where("Address = ?", toAddress).
										Update("Calls", gorm.Expr("Calls + 1")).Error

				if err != nil {
					fmt.Println("No such contract address")
				}

				Count++

				newTransaction := models.Transaction{
					Thash:       tHash,
					To:          toAddress,
					Type:        tType,
					Gas:         k.Gas(),
					Value:       tValue,
					BlockNumber: newBlock.Number,
					Time:        newBlock.Time,
				}

				if err := DB.Create(&newTransaction).Error; err != nil { // Entering details to transaction Table
					fmt.Println("Something went wrong", err)

				}
			}
			transCount := models.TransCount{
				Timestamp:     blocks.Time(),
				BlockNumber:   blocks.NumberU64(),
				Count:         Count,
				ContractCount: contractCount,
			}
			if err := DB.Create(&transCount).Error; err != nil { // Entering details to transcount table
				fmt.Println("Something went wrong", err)

			}
			fmt.Println("All Transactions entered")
			i++

		}
	}
}
