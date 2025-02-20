package threads

import (
	"context"
	"encoding/hex"
	"fmt"
	"log"
	"time"

	"github.com/pglekshmi/explorerGoPostgreSQL/Config"
	"github.com/pglekshmi/explorerGoPostgreSQL/Controllers"
	"github.com/pglekshmi/explorerGoPostgreSQL/models"
	"gorm.io/gorm"
)

func BlockQuery(DB *gorm.DB){
	Client, err := config.ConnectNode()
	if err != nil {
		fmt.Println("Error in connecting to Node")
	}
	latestBlockNumber, err := Client.BlockNumber(context.Background())
	if err != nil {
		fmt.Println("Something wrong getting data")
	}

	var lastBlock models.Block

	if err:=DB.Last(&lastBlock).Error;err!=nil{
			fmt.Println("Something wrong on getting data from DB")
		}
		
		i := lastBlock.Number
for {
	fmt.Println("hello")
    latestBlockNumber := blocks.NumberU64() // Get the latest block number dynamically
	fmt.Println("latest block",latestBlockNumber)
    if i > latestBlockNumber {
        break // Exit when i exceeds the latest block number
    }
		
			fmt.Println("hi")
			fmt.Println(i)
			blocks,err:=controllers.GetBlockDetails(i)

			if err!=nil{
				fmt.Println("Cannot get block details")
			}
			newBlock := models.Block{
				Number: blocks.NumberU64(),
				Hash: blocks.Hash().Hex(),
				ParentHash: blocks.ParentHash().Hex(),
				GasLimit: blocks.GasLimit(),
				Time: blocks.Time(),
				Size: blocks.Size(),
			}
			if err := DB.Create(&newBlock).Error; err != nil {
				fmt.Println("Error creating new block:", err)
			} else {
				fmt.Println("Block inserted successfully!")
			}
			 blockHash:=newBlock.Hash
	fmt.Println("BlovkHash",blockHash)
	fmt.Println(blocks.Body().Transactions[0].To())
	 
	for _,k:= range blocks.Body().Transactions{
		fmt.Println(k)
		 toAddress:="0x0"
		if k.To()==nil{
			toAddress = "0x0"
		}

		if(k.To()!=nil){
			toAddress = k.To().Hex()
		}

		newTransaction:= models.Transaction{
			Thash:k.Hash().Hex(),
			// To:blocks.Body().Transactions[k].To().Hex(),
			To:toAddress,

			Type:k.Type(),
			Gas:k.Gas(),
			Value:k.Value().String(),
			Data:hex.EncodeToString(k.Data()),
			BlockHash:blockHash,
		}
		fmt.Println("New Transaction",newTransaction)
	if err:=DB.Create(&newTransaction).Error; err!=nil{
		fmt.Println("Something went wrong",err)
		log.Fatalln("Something wrong happended on transaction db")
	}
	} 
	fmt.Println("All Transactions entered")
	i++
	fmt.Println(i)
		}
	}
}

func TimeTicker(DB *gorm.DB){
	ticker := time.NewTicker(10 * time.Second) // Run every 10 seconds
	defer ticker.Stop() // Ensure ticker stops when function exits

	for {
		select {
		case <-ticker.C:
			BlockQuery(DB) // Call your function
		}
	}
}