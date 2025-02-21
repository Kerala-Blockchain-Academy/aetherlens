package threads

import (
	"context"
	"encoding/hex"
	"fmt"
	"log"
	"time"

	"github.com/pglekshmi/explorerGoPostgreSQL/config"
	"github.com/pglekshmi/explorerGoPostgreSQL/controllers"
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
		
		i := lastBlock.Number+1
for {
	fmt.Println("hello")
   
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
	if len(blocks.Body().Transactions)==0{
		fmt.Println("No transactions in this block, skipping to the next block")
    	i++  // Move to the next block
		continue
	}
	Count := int64(0) 
	contractCount := 0
	 
	for _,k:= range blocks.Body().Transactions{
		fmt.Println(k)
		 toAddress:="0x0"
		if k.To()==nil{
			toAddress = "0x0"
			contractCount++
		}

		if(k.To()!=nil){
			toAddress = k.To().Hex()
		}
		Count++;

		newTransaction:= models.Transaction{
			Thash:k.Hash().Hex(),
			// To:blocks.Body().Transactions[k].To().Hex(),
			To:toAddress,

			Type:k.Type(),
			Gas:k.Gas(),
			Value:k.Value().String(),
			Data:hex.EncodeToString(k.Data()),
			BlockNumber:newBlock.Number,
		}
		fmt.Println("New Transaction",newTransaction)
	if err:=DB.Create(&newTransaction).Error; err!=nil{
		fmt.Println("Something went wrong",err)
		log.Fatalln("Something wrong happended on transaction db")
	}
	} 
	transCount := models.TransCount{
		Timestamp: blocks.Time(),
		BlockNumber: blocks.NumberU64(),
		Count:Count,
		ContractCount: contractCount,
	}
	if err := DB.Create(&transCount).Error; err != nil {
		fmt.Println("Something went wrong", err)
		
	}
	fmt.Println("All Transactions entered")
	i++
	fmt.Println(i)
		}
	}


	func Task(DB *gorm.DB) {
		ticker := time.NewTicker(15 * time.Second)
	defer ticker.Stop()

	for t := range ticker.C {
	
		
			fmt.Println("Executing BlockQuery...",t)
			BlockQuery(DB)

	}
	}
	
	