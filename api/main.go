package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/pglekshmi/explorerGoPostgreSQL/config"
	"github.com/pglekshmi/explorerGoPostgreSQL/controllers"
	"github.com/pglekshmi/explorerGoPostgreSQL/db"
	"github.com/pglekshmi/explorerGoPostgreSQL/models"
	"github.com/pglekshmi/explorerGoPostgreSQL/threads"
)

func main() {
	DB, err := db.RetryConnectDB(10, 2*time.Second) // Connecting with DB
	if err != nil {
		fmt.Println("Cannot connect to DB")
	}

	if err := DB.AutoMigrate(&models.Block{}, &models.Transaction{}, &models.TransCount{}, models.Contract_call{}); err != nil {
		fmt.Println("Error in AutoMigrate:", err) // Creating tables if not there
		log.Fatal(err)
	} else {
		fmt.Println("AutoMigrate successful!")
	}
	Client, _ := config.RetryConnectNode(5, 2*time.Second) // Connecting with Node
	go func(){
		fmt.Println("Setting Up fiber")
		app := fiber.New()
		app.Use(logger.New())
		app.Use(cors.New())

		app.Get("/today", func(c *fiber.Ctx) error { // Today's hourly Transaction count
		return controllers.GetdailyCount(c, DB)
	})

	app.Get("/tenday", func(c *fiber.Ctx) error { // Last Ten day's Transaction Count
		return controllers.GetlasttenCount(c, DB)
	})

	app.Get("/blocks", func(c *fiber.Ctx) error { // Last 20 block Details
		return controllers.Get20Blocks(c, DB)
	})

	app.Get("/block/:id", func(c *fiber.Ctx) error { // Block Details of queried number
		return controllers.GetBlockbyNymber(c, DB)
	})

	app.Get("/trans", func(c *fiber.Ctx) error { // Last 20 Transaction details
		return controllers.Get20Transactions(c, DB)
	})

	app.Get("/trans/:id", func(c *fiber.Ctx) error { // Transaction details of queried transaction hash
		return controllers.GetTransbyHash(c, DB)
	})

	app.Get("/transBlock/:id", func(c *fiber.Ctx) error { // Transaction details of queried block number
		return controllers.GetTransbyBlock(c, DB)
	})

	app.Get("/transCount", func(c *fiber.Ctx) error { // Total Transaction count
		return controllers.GetTotalTransactions(c, DB)
	})

	app.Get("/contractCount", func(c *fiber.Ctx) error { // Total Contract Created
		return controllers.GetContractCount(c, DB)
	})

	app.Get("/blockDetails", func(c *fiber.Ctx) error { // Total Contract Created
		return controllers.GettenBlockDetails(c, DB)
	})

	app.Get("/txCountbyNumber/:id", func(c *fiber.Ctx) error { // TransactionCount on a block
		return controllers.TxCountbyNumber(c, DB)
	})

	app.Get("/txByNumber/:id", func(c *fiber.Ctx) error { // Transactions on a block
		return controllers.TxByNumber(c, DB)
	})

	app.Get("/latestBlock", func(c *fiber.Ctx) error { // Get Latest Block
		return controllers.GetLatestBlock(c, DB)
	})

	app.Listen(":" + os.Getenv("API_PORT"))

	}()
	
	if Client != nil {
		go func() {
			var firstBlock models.Block
		
			if err := DB.First(&firstBlock).Error; err != nil { // Checking whether DB is empty
				latestBlockNumber, err := Client.BlockNumber(context.Background()) // Get the latest block number
				if err != nil {
					fmt.Println("Something wrong getting data", err)
					return
				}
		
				var wg sync.WaitGroup
				totalBlocks := latestBlockNumber
				numGoroutines := uint64(20) // Number of concurrent goroutines
				blocksPerRoutine := totalBlocks / numGoroutines
				fmt.Printf("Blocks per Routine: %v\n", blocksPerRoutine)
		
				if blocksPerRoutine < numGoroutines {
					controllers.BlockDetails(uint64(0), totalBlocks, DB, Client)
				} else {
					for j := uint64(0); j < numGoroutines; j++ {
						start := j * blocksPerRoutine // Start from 0
						end := (j + uint64(1)) * blocksPerRoutine
		
						// Ensure the last goroutine processes any remaining blocks
						if j == numGoroutines-1 {
							end = totalBlocks
						}
		
						wg.Add(1)
		
						go func(start, end uint64) {
							fmt.Printf("Start: %d, End: %d\n", start, end)
							defer wg.Done()
							controllers.BlockDetails(start, end, DB, Client)
						}(start, end)
					}
		
					wg.Wait()
				}
		
				fmt.Println("All block details fetched")
			}
		
			go threads.Task(DB) // Running a parallel thread to get the updates
		}()
	}

	select {}	
}
