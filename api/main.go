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
	"github.com/pglekshmi/explorerGoPostgreSQL/middleware"
)

func main() {
	DB, err := db.RetryConnectDB(10, 2*time.Second) // Connecting with DB
	if err != nil {
		fmt.Println("Cannot connect to DB")
	}

	if err := DB.AutoMigrate(&models.Block{}, &models.Transaction{}, &models.TransCount{}, models.Contract_call{}, models.Register{}); err != nil {
		fmt.Println("Error in AutoMigrate:", err) // Creating tables if not there
		log.Fatal(err)
	} else {
		fmt.Println("AutoMigrate successful!")
	}
	Client, _ := config.RetryConnectNode(5, 2*time.Second) // Connecting with Node

	fmt.Println("Setting Up fiber")
	app := fiber.New()
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://127.0.0.1",
		AllowHeaders: "Origin, Content-Type, Accept",
		AllowCredentials: true,
	}))

	app.Post("/register", func(c *fiber.Ctx) error { // Get All Contracts
		return controllers.Register(c, DB)
	})

	app.Post("/login", func(c *fiber.Ctx) error { // Get All Contracts
		return controllers.Login(c, DB)
	})

	app.Post("/logout", func(c *fiber.Ctx) error { // Get All Contracts
		return controllers.Logout(c, DB)
	})

	app.Get("/verify", middleware.VerifyToken, func(c *fiber.Ctx) error { // verify user
		return controllers.VerifyUser(c)
	})

	app.Get("/allContracts",middleware.VerifyToken,middleware.VerifyAdmin,func(c *fiber.Ctx) error { // Get All Contracts
		return controllers.GetAllContracts(c, DB)
	})

	app.Get("/tooDay",middleware.VerifyToken,middleware.VerifyAdmin, func(c *fiber.Ctx) error { // Today's hourly Transaction count
		return controllers.GetdailyCount(c, DB)
	})

	app.Get("/tenday",middleware.VerifyToken,middleware.VerifyAdmin, func(c *fiber.Ctx) error { // Last Ten day's Transaction Count
		return controllers.GetlasttenCount(c, DB)
	})

	app.Get("/blocks", middleware.VerifyToken,middleware.VerifyAdmin,func(c *fiber.Ctx) error { // Last 20 block Details
		return controllers.Get20Blocks(c, DB)
	})

	app.Get("/block/:id",middleware.VerifyToken,middleware.VerifyAdmin, func(c *fiber.Ctx) error { // Block Details of queried number
		return controllers.GetBlockbyNymber(c, DB)
	})

	app.Get("/trans", middleware.VerifyToken,middleware.VerifyAdmin,func(c *fiber.Ctx) error { // Last 20 Transaction details
		return controllers.Get20Transactions(c, DB)
	})

	app.Get("/trans/:id",middleware.VerifyToken,middleware.VerifyAdmin, func(c *fiber.Ctx) error { // Transaction details of queried transaction hash
		return controllers.GetTransbyHash(c, DB)
	})

	app.Get("/transBlock/:id",middleware.VerifyToken,middleware.VerifyAdmin, func(c *fiber.Ctx) error { // Transaction details of queried block number
		return controllers.GetTransbyBlock(c, DB)
	})

	app.Get("/transCount", middleware.VerifyToken,middleware.VerifyAdmin,func(c *fiber.Ctx) error { // Total Transaction count
		return controllers.GetTotalTransactions(c, DB)
	})

	app.Get("/contractCount", middleware.VerifyToken,middleware.VerifyAdmin,func(c *fiber.Ctx) error { // Total Contract Created
		return controllers.GetContractCount(c, DB)
	})

	app.Get("/blockDetails", middleware.VerifyToken,middleware.VerifyAdmin,func(c *fiber.Ctx) error { // Total Contract Created
		return controllers.GettenBlockDetails(c, DB)
	})

	app.Get("/txCountbyNumber/:id",middleware.VerifyToken,middleware.VerifyAdmin, func(c *fiber.Ctx) error { // TransactionCount on a block
		return controllers.TxCountbyNumber(c, DB)
	})

	app.Get("/txByNumber/:id",middleware.VerifyToken,middleware.VerifyAdmin, func(c *fiber.Ctx) error { // Transactions on a block
		return controllers.TxByNumber(c, DB)
	})

	app.Get("/txByHash/:id",middleware.VerifyToken,middleware.VerifyAdmin, func(c *fiber.Ctx) error { // Transactions on a block
		return controllers.TxByHash(c, DB)
	})

	app.Get("/txPresent/:id",middleware.VerifyToken,middleware.VerifyAdmin, func(c *fiber.Ctx) error { // Transactions on a block
		return controllers.GetTxPresent(c, DB)
	})

	app.Get("/latestBlock", func(c *fiber.Ctx) error { // Get Latest Block
		return controllers.GetLatestBlock(c, DB)
	})

	app.Get("/contractTx/:id", middleware.VerifyToken,middleware.VerifyAdmin,func(c *fiber.Ctx) error { // Get all Transactions of a Contract Address
		return controllers.GetAllContractTx(c, DB)
	})

	if Client != nil {
		go func() {
			var firstBlock models.Block

			if err := DB.First(&firstBlock).Error; err != nil { // Checking whether DB is empty
				latestBlockNumber, err := Client.BlockNumber(context.Background()) // Get the latest block number
				fmt.Println("Latest Block",latestBlockNumber)
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

	app.Listen(":" + os.Getenv("API_PORT"))
}
