package threads

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/ethereum/go-ethereum/core/types"
	"github.com/pglekshmi/explorerGoPostgreSQL/config"
	"github.com/pglekshmi/explorerGoPostgreSQL/controllers"
	"github.com/pglekshmi/explorerGoPostgreSQL/models"
	"gorm.io/gorm"
)

func BlockQuery(DB *gorm.DB) {
	Client, err := config.RetryConnectNode(5, 2*time.Second)
	if err != nil {
		fmt.Println("Error in connecting to Node")
	}
	latestBlockNumber, err := Client.BlockNumber(context.Background())
	fmt.Println("Latest Block",latestBlockNumber)
	if err != nil {
		fmt.Println("Something wrong getting data")
	}

	var lastBlock uint64

	if err := DB.Table("blocks").Select("MAX(number)").Scan(&lastBlock).Error; err != nil {
		fmt.Println("Something wrong on getting data from DB")
	}

	fmt.Println("Last Block",lastBlock)

	i := lastBlock + 1
	for {

		if i > latestBlockNumber {
			break // Exit when i exceeds the latest block number
		}

		blocks, err := controllers.GetBlockDetails(i)

		var exists bool
		if err != nil {
			fmt.Println(err)
			continue
		}

		err1 := DB.Raw("SELECT EXISTS (SELECT 1 FROM blocks WHERE number=?)",blocks.NumberU64()).Scan(&exists).Error
		if(err1!=nil){
			fmt.Println("Something went wrong in DB")
		}else if(!exists){
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
			fmt.Printf("Block %d inserted successfully!\n", i)
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

			chainId := k.ChainId()

			Sender, _ := types.Sender(types.LatestSignerForChainID(chainId), k)

			toAddress := controllers.TransAddressCheck(k)
			fromAddr := controllers.TransFromCheck(Sender)
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
				Thash:       tHash,
				ToAddress:   toAddress,
				FromAddress: fromAddr,
				Type:        tType,
				Gas:         k.Gas(),
				Value:       tValue,
				BlockNumber: newBlock.Number,
				Time:        newBlock.Time,
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
	}else{
		fmt.Println("Block already in DB")
	}
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
